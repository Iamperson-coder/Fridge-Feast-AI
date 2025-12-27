import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type GenerateRecipeRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// Fetch all recipes (History)
export function useRecipes() {
  return useQuery({
    queryKey: [api.recipes.list.path],
    queryFn: async () => {
      const res = await fetch(api.recipes.list.path);
      if (!res.ok) throw new Error("Failed to fetch menu history");
      return api.recipes.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch single recipe
export function useRecipe(id: number) {
  return useQuery({
    queryKey: [api.recipes.get.path, id],
    queryFn: async () => {
      const url = api.recipes.get.path.replace(":id", String(id));
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch recipe");
      }
      return api.recipes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Generate new recipe
export function useGenerateRecipe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateRecipeRequest) => {
      // Validate input before sending
      const validated = api.recipes.generate.input.parse(data);
      
      const res = await fetch(api.recipes.generate.path, {
        method: api.recipes.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create your dish");
      }

      return api.recipes.generate.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recipes.list.path] });
      toast({
        title: "Order Up!",
        description: "The chef has prepared your special dish.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Kitchen Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
