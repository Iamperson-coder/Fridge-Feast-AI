import { useState } from "react";
import { Layout } from "@/components/Layout";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeCard } from "@/components/RecipeCard";
import { useGenerateRecipe } from "@/hooks/use-recipes";
import { Loader2, Sparkles, ChefHat, Camera, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { mutate: generateRecipe, data: recipe, isPending } = useGenerateRecipe();

  const handleGenerate = () => {
    if (ingredients.length > 0) {
      generateRecipe({ ingredients });
    }
  };

  const handleReset = () => {
    setIngredients([]);
  };

  // 📷 Simulated AI Photo Scanner
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsScanning(true);

      // Simulate an AI vision analysis taking 2.5 seconds
      setTimeout(() => {
        const detectedIngredients = ["Eggs", "Milk", "Tomatoes", "Cheese"];

        // Add unique items only to your current list
        setIngredients((prev) => {
          const combined = [...prev, ...detectedIngredients];
          return Array.from(new Set(combined));
        });

        setIsScanning(false);
      }, 2500);
    }
  };

  return (
    <Layout>
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Input Section */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-sm paper-shadow border-t-4 border-primary relative overflow-hidden">

            {/* 🧠 Scanning Overlay */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center text-center p-6"
                >
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <h4 className="font-serif font-bold text-xl text-primary">AI Vision Scanner</h4>
                  <p className="text-sm text-muted-foreground max-w-[200px] mt-1">
                    Analyzing photo to extract ingredients...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-primary">Chef's Request</h2>
                  <p className="text-sm text-muted-foreground">What's in your pantry?</p>
                </div>
              </div>

              {/* 📸 Hidden Input & Visible Photo Trigger Button */}
              <div>
                <label 
                  htmlFor="fridge-camera" 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground text-xs font-medium rounded-md cursor-pointer hover:bg-accent/80 transition-colors border border-primary/10"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Scan Fridge
                </label>
                <input 
                  type="file" 
                  id="fridge-camera" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={handlePhotoUpload}
                  disabled={isPending || isScanning}
                />
              </div>
            </div>

            <IngredientInput 
              ingredients={ingredients} 
              onChange={setIngredients}
              disabled={isPending}
            />

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleGenerate}
                disabled={ingredients.length === 0 || isPending || isScanning}
                className="
                  flex-1 py-3 px-6 rounded-md font-serif font-bold text-lg
                  bg-primary text-primary-foreground shadow-lg shadow-primary/20
                  hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-md
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  transition-all duration-300 flex items-center justify-center gap-2
                "
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Cooking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Create Menu</span>
                  </>
                )}
              </button>

              {ingredients.length > 0 && (
                <button 
                  onClick={handleReset}
                  disabled={isPending || isScanning}
                  className="px-4 py-3 rounded-md border border-primary/20 text-primary font-serif hover:bg-primary/5 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-secondary/30 p-6 rounded-sm border border-primary/5">
            <h3 className="font-serif font-bold text-primary mb-2">Chef's Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground italic font-serif">
              <li>Add proteins for a hearty main course</li>
              <li>Don't forget spices and herbs</li>
              <li>Include vegetables for balance</li>
              <li>More ingredients = more complex flavors</li>
            </ul>
          </div>
        </section>

        {/* Output Section */}
        <section className="lg:col-span-3 min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            {isPending ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white/50 border-2 border-dashed border-primary/10 rounded-sm"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
                  <ChefHat className="w-24 h-24 text-primary relative z-10 animate-bounce" style={{ animationDuration: '3s' }} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-2">The Kitchen is Busy</h3>
                <p className="text-muted-foreground font-serif italic text-lg max-w-xs mx-auto">
                  Our AI chefs are crafting a unique recipe based on your ingredients...
                </p>
              </motion.div>
            ) : recipe ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-40"
              >
                <div className="border-4 border-primary/20 p-8 rounded-full mb-6">
                  <UtensilsCrossed className="w-16 h-16 text-primary" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-primary mb-2">Awaiting Order</h3>
                <p className="font-serif italic text-lg max-w-md mx-auto">
                  Add your ingredients on the left and let our culinary AI surprise you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </Layout>
  );
}
