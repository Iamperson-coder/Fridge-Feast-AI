import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Analyze a fridge/pantry photo and extract ingredients ──────────────
  app.post("/api/analyze-photo", async (req, res) => {
    try {
      const { image } = req.body as { image: string };
      if (!image) return res.status(400).json({ message: "No image provided" });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: image, detail: "auto" },
              },
              {
                type: "text",
                text: `Look at this image of a fridge, pantry, or food cabinet.
List every food ingredient you can clearly and confidently identify.
Ignore anything that is not a recognizable food ingredient (containers without labels, non-food items, unclear items).
Return ONLY a JSON object like: { "ingredients": ["Chicken", "Eggs", "Tomatoes"] }
Use proper English names, capitalize each ingredient.`,
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 300,
      });

      const data = JSON.parse(response.choices[0].message.content || "{}");
      res.json({ ingredients: data.ingredients || [] });
    } catch (error) {
      console.error("Photo analysis error:", error);
      res.status(500).json({ message: "Failed to analyze photo", ingredients: [] });
    }
  });

  // ── Suggest a list of 3 recipes from available ingredients ─────────────
  app.post("/api/recipes/suggest", async (req, res) => {
    try {
      const { ingredients } = req.body as { ingredients: string[] };
      if (!ingredients?.length) return res.status(400).json({ message: "No ingredients provided" });

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content: "You are a world-class chef. You only respond in JSON.",
          },
          {
            role: "user",
            content: `Given these ingredients: ${ingredients.join(", ")}.
Suggest exactly 3 different recipes that can be made using ONLY these ingredients plus basic pantry staples (salt, pepper, oil, water, vinegar, basic spices).
Pick from diverse cuisines: Middle Eastern, Western, African, Italian, Turkish, Asian, Latin American.
Return JSON: { "suggestions": [{ "title": "...", "description": "A 1-2 sentence appetizing description mentioning the cuisine style and why it works", "cuisine": "e.g. Italian" }] }`,
          },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 600,
      });

      const data = JSON.parse(response.choices[0].message.content || "{}");
      res.json({ suggestions: data.suggestions || [] });
    } catch (error) {
      console.error("Suggestion error:", error);
      res.status(500).json({ message: "Failed to suggest recipes" });
    }
  });

  // ── Generate the full recipe + dish image for a selected suggestion ────
  app.post(api.recipes.generate.path, async (req, res) => {
    try {
      const { ingredients, selectedRecipe } = req.body as {
        ingredients: string[];
        selectedRecipe?: { title: string; description: string; cuisine: string };
      };

      const ingredientList = ingredients.join(", ");
      const recipeContext = selectedRecipe
        ? `The recipe is "${selectedRecipe.title}" — a ${selectedRecipe.cuisine} dish. ${selectedRecipe.description}`
        : "";

      const prompt = `
        You are a gourmet chef. Create a detailed recipe using ONLY these ingredients: ${ingredientList}.
        You can assume basic pantry staples (salt, pepper, oil, water, vinegar, basic spices) are available.
        ${recipeContext}

        CRITICAL: Your response MUST be a valid JSON object:
        {
          "title": "${selectedRecipe?.title || "A creative appetizing title"}",
          "description": "A brief story of this dish and its cultural origin",
          "cuisine": "${selectedRecipe?.cuisine || "the most fitting cuisine type"}",
          "ingredients_list": ["measured ingredient 1", "measured ingredient 2"],
          "instructions": ["step 1", "step 2", "..."]
        }

        Do not include any markdown formatting outside the JSON object.
      `;

      const recipeResponse = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are a world-class chef. You only speak in JSON." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 1200,
      });

      const responseText = recipeResponse.choices[0].message.content || "{}";
      const recipeData = JSON.parse(responseText);

      const title = recipeData.title || selectedRecipe?.title || "Chef's Creation";
      const cuisine = recipeData.cuisine || selectedRecipe?.cuisine || "International";

      const formattedContent = `
# ${title}

**Cuisine:** ${cuisine}

${recipeData.description || ""}

### Ingredients
${(recipeData.ingredients_list || ingredients).map((i: string) => `- ${i}`).join("\n")}

### Instructions
${(recipeData.instructions || []).map((s: string, idx: number) => `${idx + 1}. ${s}`).join("\n")}
      `.trim();

      // Generate a dish image with DALL-E
      let imageUrl: string | null = null;
      try {
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: `Professional food photography of ${title}, ${cuisine} cuisine. Beautiful restaurant plating on a white ceramic plate, warm natural lighting, shallow depth of field, top-down or 45-degree angle shot, appetizing and vibrant colors.`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        });
        imageUrl = imageResponse.data?.[0]?.url ?? null;
      } catch (imgErr) {
        console.warn("Image generation skipped:", imgErr);
      }

      const recipe = await storage.createRecipe({
        title,
        content: formattedContent,
        ingredients,
        imageUrl,
      });

      res.json(recipe);
    } catch (error) {
      console.error("Recipe generation error:", error);
      res.status(500).json({ message: "Failed to generate recipe" });
    }
  });

  // ── List all saved recipes ─────────────────────────────────────────────
  app.get(api.recipes.list.path, async (req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  // ── Get a single recipe by id ──────────────────────────────────────────
  app.get(api.recipes.get.path, async (req, res) => {
    const recipe = await storage.getRecipe(Number(req.params.id));
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  });

  // ── Ingredient search ──────────────────────────────────────────────────
  app.get(api.ingredients.search.path, async (req, res) => {
    const query = req.query.q as string;
    if (!query) return res.json([]);
    const matches = await storage.searchIngredients(query);
    res.json(matches);
  });

  // Seed common ingredients
  await storage.seedIngredients([
    "Maple Syrup", "Flour", "Sugar", "Butter", "Eggs", "Milk",
    "Chicken", "Beef", "Pork", "Lamb", "Salmon", "Shrimp",
    "Garlic", "Onion", "Tomatoes", "Potatoes", "Carrots", "Spinach",
    "Bell Pepper", "Zucchini", "Mushrooms", "Broccoli", "Corn",
    "Lemon", "Lime", "Orange", "Apple", "Banana",
    "Rice", "Pasta", "Noodles", "Bread", "Oats",
    "Olive Oil", "Soy Sauce", "Honey", "Cheese", "Yogurt",
    "Cumin", "Paprika", "Cinnamon", "Turmeric", "Ginger",
    "Salt", "Pepper", "Chili Flakes", "Basil", "Oregano",
  ]);

  return httpServer;
}
