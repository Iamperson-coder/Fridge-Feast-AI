import { z } from "zod";
import { recipes, insertRecipeSchema, generateRecipeSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  recipes: {
    generate: {
      method: "POST" as const,
      path: "/api/recipes/generate",
      input: generateRecipeSchema,
      responses: {
        200: z.custom<typeof recipes.$inferSelect>(),
        500: errorSchemas.internal,
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/recipes",
      responses: {
        200: z.array(z.custom<typeof recipes.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/recipes/:id",
      responses: {
        200: z.custom<typeof recipes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  ingredients: {
    search: {
      method: "GET" as const,
      path: "/api/ingredients/search",
      input: z.object({
        q: z.string(),
      }),
      responses: {
        200: z.array(z.string()),
      },
    },
  },
};
