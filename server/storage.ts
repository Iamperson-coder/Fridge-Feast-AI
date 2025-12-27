import { db } from "./db";
import { recipes, ingredients, type InsertRecipe, type Recipe } from "@shared/schema";
import { desc, eq, ilike } from "drizzle-orm";

export interface IStorage {
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  searchIngredients(query: string): Promise<string[]>;
  seedIngredients(names: string[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const [recipe] = await db.insert(recipes).values(insertRecipe).returning();
    return recipe;
  }

  async getRecipes(): Promise<Recipe[]> {
    return await db.select().from(recipes).orderBy(desc(recipes.createdAt));
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }

  async searchIngredients(query: string): Promise<string[]> {
    const results = await db
      .select({ name: ingredients.name })
      .from(ingredients)
      .where(ilike(ingredients.name, `%${query}%`))
      .limit(10);
    return results.map(r => r.name);
  }

  async seedIngredients(names: string[]): Promise<void> {
    for (const name of names) {
      await db.insert(ingredients).values({ name }).onConflictDoNothing();
    }
  }
}

export const storage = new DatabaseStorage();
