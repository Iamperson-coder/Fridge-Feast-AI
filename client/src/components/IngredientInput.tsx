import { useState, useRef } from "react";
import { Plus, X, Carrot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
  disabled?: boolean;
}

export function IngredientInput({ ingredients, onChange, disabled }: IngredientInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addIngredient = () => {
    const trimmed = input.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onChange([...ingredients, trimmed]);
      setInput("");
      inputRef.current?.focus();
    }
  };

  const removeIngredient = (ing: string) => {
    onChange(ingredients.filter((i) => i !== ing));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
          <Carrot className="w-6 h-6" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Enter an ingredient (e.g. Chicken, Basil, Tomatoes)"
          className="
            w-full pl-12 pr-14 py-4 rounded-md text-lg font-serif
            bg-white border-2 border-primary/20 text-foreground
            placeholder:text-muted-foreground/60
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 paper-shadow
          "
        />
        <button
          onClick={addIngredient}
          disabled={!input.trim() || disabled}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            p-2 rounded-full bg-primary text-primary-foreground
            hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground
            transition-colors
          "
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="min-h-[100px] p-4 bg-white/50 rounded-md border border-dashed border-primary/20">
        {ingredients.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground font-serif italic opacity-60 py-4">
            <span className="text-lg">Your pantry is empty</span>
            <span className="text-sm">Add ingredients above to start cooking</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {ingredients.map((ing) => (
                <motion.span
                  key={ing}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  layout
                  className="
                    inline-flex items-center gap-2 pl-3 pr-1 py-1.5 
                    bg-white border border-primary/20 rounded-full
                    text-foreground font-serif shadow-sm
                  "
                >
                  {ing}
                  <button
                    onClick={() => removeIngredient(ing)}
                    disabled={disabled}
                    className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
