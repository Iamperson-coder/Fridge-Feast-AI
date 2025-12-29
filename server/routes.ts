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
  app.post(api.recipes.generate.path, async (req, res) => {
    try {
      const { ingredients } = api.recipes.generate.input.parse(req.body);

      const prompt = `
        You are a gourmet chef. Create a delicious recipe using these ingredients: ${ingredients.join(", ")}.
        You can assume basic pantry staples (salt, pepper, oil, etc.).
        
        CRITICAL: Your response MUST be a valid JSON object with the following structure:
        {
          "title": "A creative, appetizing Title",
          "description": "A brief description/story including the cuisine's origin (e.g. Middle Eastern, Western, African, Italian, Turkish, etc.)",
          "cuisine": "The specific cuisine type",
          "ingredients_list": ["item 1", "item 2"],
          "instructions": ["step 1", "step 2"]
        }
        
        Explore diverse culinary traditions such as Middle Eastern, Western, African, Italian, Turkish, Asian, and Latin American. Choose the one that best suits the provided ingredients.
        
        Do not include any markdown formatting outside the JSON object.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are a world-class chef helping home cooks. You only speak in JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 1000,
      });

      const responseText = response.choices[0].message.content || "{}";
      const recipeData = JSON.parse(responseText);
      
      const title = recipeData.title || "Chef's Creation";
      const formattedContent = `
# ${title}

**Cuisine:** ${recipeData.cuisine || "International"}

${recipeData.description || ""}

### Ingredients
${(recipeData.ingredients_list || []).map((i: string) => `- ${i}`).join('\n')}

### Instructions
${(recipeData.instructions || []).map((s: string, idx: number) => `${idx + 1}. ${s}`).join('\n')}
      `.trim();

      const recipe = await storage.createRecipe({
        title,
        content: formattedContent,
        ingredients,
      });

      res.json(recipe);
    } catch (error) {
      console.error("Recipe generation error:", error);
      res.status(500).json({ message: "Failed to generate recipe" });
    }
  });

  app.get(api.recipes.list.path, async (req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  app.get(api.recipes.get.path, async (req, res) => {
    const recipe = await storage.getRecipe(Number(req.params.id));
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  });

  app.get(api.ingredients.search.path, async (req, res) => {
    const query = req.query.q as string;
    if (!query) return res.json([]);
    const matches = await storage.searchIngredients(query);
    res.json(matches);
  });

  // Seed some common ingredients including maple syrup
  await storage.seedIngredients([
    "Maple Syrup", "Flour", "Sugar", "Butter", "Eggs", "Milk", 
    "Chicken", "Beef", "Pork", "Garlic", "Onion", "Salt", "Pepper"
  ]);

  return httpServer;
}
