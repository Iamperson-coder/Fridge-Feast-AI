import { Recipe } from "@shared/schema";
import { format } from "date-fns";
import { Scroll, Clock, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
  onClick?: () => void;
}

export function RecipeCard({ recipe, compact = false, onClick }: RecipeCardProps) {
  // Simple check to differentiate display vs compact list view
  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01, rotate: -0.5 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className="
          cursor-pointer bg-white p-5 rounded-sm paper-shadow border border-primary/10
          hover:border-primary/40 hover:shadow-lg transition-all duration-300
          relative overflow-hidden group
        "
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
        <div className="pl-3">
          <h3 className="font-serif text-xl font-bold text-primary truncate pr-4">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground font-serif italic">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(recipe.createdAt), "MMMM d, yyyy")}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {recipe.ingredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full border border-primary/10">
                {ing}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="text-xs px-2 py-0.5 text-muted-foreground">
                +{recipe.ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Full detail view styled like a menu item
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 md:p-12 rounded-sm paper-shadow border-4 double-border relative max-w-3xl mx-auto"
    >
      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />

      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 mb-4 border border-primary text-primary text-xs font-bold uppercase tracking-widest">
          Today's Special
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
          {recipe.title}
        </h2>
        <div className="flex items-center justify-center gap-2 text-primary/60 italic font-serif">
          <ChefHat className="w-5 h-5" />
          <span>Prepared fresh by AI Chef</span>
        </div>
      </div>

      <div className="ornament-divider">
        <span>Ingredients</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {recipe.ingredients.map((ingredient, idx) => (
          <div key={idx} className="flex items-baseline gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <span className="font-serif italic text-lg text-foreground/80">{ingredient}</span>
          </div>
        ))}
      </div>

      <div className="ornament-divider">
        <span>Preparation</span>
      </div>

      <div className="prose prose-stone prose-lg max-w-none font-serif text-foreground/90 leading-relaxed">
        <div className="whitespace-pre-line">
          {recipe.content}
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-dashed border-primary/20 flex justify-between items-center text-sm text-muted-foreground font-sans">
        <span>Order #{recipe.id.toString().padStart(4, '0')}</span>
        <span>{format(new Date(recipe.createdAt), "PPP")}</span>
      </div>
    </motion.div>
  );
}
