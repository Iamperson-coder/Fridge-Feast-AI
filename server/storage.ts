import { db } from "./db";
import { recipes, type InsertRecipe, type Recipe } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
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
}

export const storage = new DatabaseStorage();
