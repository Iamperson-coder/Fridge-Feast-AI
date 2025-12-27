import { Layout } from "@/components/Layout";
import { RecipeCard } from "@/components/RecipeCard";
import { useRecipes } from "@/hooks/use-recipes";
import { useLocation } from "wouter";
import { Loader2, SearchX } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
  const { data: recipes, isLoading, isError } = useRecipes();
  const [_, setLocation] = useLocation();

  const handleCardClick = (id: number) => {
    setLocation(`/recipe/${id}`);
  };

  return (
    <Layout>
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-serif font-bold text-primary mb-4">Past Orders</h2>
        <div className="ornament-divider max-w-xs mx-auto opacity-50">
          <span>Archive</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-destructive">
          <p className="font-serif text-xl">Unable to retrieve menu history.</p>
        </div>
      ) : recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RecipeCard 
                recipe={recipe} 
                compact 
                onClick={() => handleCardClick(recipe.id)} 
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 opacity-60">
          <SearchX className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-primary mb-2">No Records Found</h3>
          <p className="font-serif italic text-muted-foreground">
            You haven't generated any recipes yet. Visit the Chef's Table to start cooking.
          </p>
        </div>
      )}
    </Layout>
  );
}
