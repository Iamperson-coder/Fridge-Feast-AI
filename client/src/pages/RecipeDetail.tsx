import { useRecipe } from "@/hooks/use-recipes";
import { Layout } from "@/components/Layout";
import { RecipeCard } from "@/components/RecipeCard";
import { useRoute, useLocation } from "wouter";
import { Loader2, ArrowLeft, Printer } from "lucide-react";
import { motion } from "framer-motion";

export default function RecipeDetail() {
  const [match, params] = useRoute("/recipe/:id");
  const [_, setLocation] = useLocation();
  const id = match && params?.id ? parseInt(params.id) : 0;
  
  const { data: recipe, isLoading, isError } = useRecipe(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (isError || !recipe) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-serif text-destructive mb-4">Recipe not found</h2>
          <button 
            onClick={() => setLocation("/history")}
            className="text-primary hover:underline font-serif"
          >
            Back to Menu
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={() => setLocation("/history")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-serif italic"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-serif font-bold print:hidden"
        >
          <Printer className="w-4 h-4" />
          Print Card
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RecipeCard recipe={recipe} />
      </motion.div>
    </Layout>
  );
}
