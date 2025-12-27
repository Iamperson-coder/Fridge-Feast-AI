import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  ingredients: text("ingredients").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
});

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
});

export type Ingredient = typeof ingredients.$inferSelect;

// API Schemas
export const generateRecipeSchema = z.object({
  ingredients: z.array(z.string()).min(1, "Please enter at least one ingredient"),
});

export type GenerateRecipeRequest = z.infer<typeof generateRecipeSchema>;
