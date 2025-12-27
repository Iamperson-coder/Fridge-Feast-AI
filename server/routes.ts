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
        
        Format the response clearly with:
        - A creative, appetizing Title
        - A brief description/story
        - List of Ingredients
        - Step-by-step Instructions
        
        Keep the tone elegant and restaurant-like.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are a world-class chef helping home cooks." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content || "Could not generate recipe.";
      
      // Extract title from content (simple heuristic: first line or "Title:" prefix)
      const titleMatch = content.match(/^#? ?Title:? ?(.+)$/m) || content.match(/^#? ?(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : "Chef's Creation";

      const recipe = await storage.createRecipe({
        title,
        content,
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

  return httpServer;
}
