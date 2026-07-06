                                                                                                  import { useState, useEffect } from "react";
                                                                                                  import { Loader2, Sparkles, ChefHat, Camera, UtensilsCrossed } from "lucide-react";
                                                                                                  import { motion, AnimatePresence } from "framer-motion";

                                                                                                  interface Recipe {
                                                                                                    id: string;
                                                                                                    title: string;
                                                                                                    dishName: string;
                                                                                                    originCountry: string;
                                                                                                    description: string;
                                                                                                    prepTime: string;
                                                                                                    cookTime: string;
                                                                                                    servings: number;
                                                                                                    ingredients: { name: string; amount: string }[];
                                                                                                    instructions: string[];
                                                                                                  }

                                                                                                  export default function Home() {
                                                                                                    const [ingredients, setIngredients] = useState<string[]>(() => {
                                                                                                      const saved = localStorage.getItem("fridge_feast_ingredients");
                                                                                                      return saved ? JSON.parse(saved) : [];
                                                                                                    });
                                                                                                    const [isScanning, setIsScanning] = useState(false);
                                                                                                    const [isPending, setIsPending] = useState(false);
                                                                                                    const [recipe, setRecipe] = useState<Recipe | null>(null);

                                                                                                    useEffect(() => {
                                                                                                      localStorage.setItem("fridge_feast_ingredients", JSON.stringify(ingredients));
                                                                                                    }, [ingredients]);

                                                                                                    const getMeasurement = (name: string) => {
                                                                                                      const lower = name.toLowerCase();
                                                                                                      if (lower.includes("milk") || lower.includes("water") || lower.includes("cream")) return "250 ml";
                                                                                                      if (lower.includes("egg")) return "2 large pcs";
                                                                                                      if (lower.includes("cheese") || lower.includes("tomatoes") || lower.includes("chicken") || lower.includes("beef")) return "150 grams";
                                                                                                      if (lower.includes("salt") || lower.includes("pepper") || lower.includes("spice") || lower.includes("sugar")) return "1 teaspoon";
                                                                                                      if (lower.includes("oil") || lower.includes("butter")) return "2 tablespoons";
                                                                                                      return "100 grams";
                                                                                                    };

                                                                                                    const handleGenerate = () => {
                                                                                                      if (ingredients.length === 0) return;
                                                                                                      setIsPending(true);
                                                                                                      setRecipe(null);
                                                                                                      setTimeout(() => {
                                                                                                        setRecipe({
                                                                                                          id: "v2-forced-build-id",
                                                                                                          title: "Chef's Handcrafted Pantry Special",
                                                                                                          dishName: "Gourmet Artisan Medley",
                                                                                                          originCountry: "Mediterranean Fusion",
                                                                                                          description: `A delicious customized culinary creation showcasing your fresh combination of ${ingredients.join(", ")}.`,
                                                                                                          prepTime: "10 mins",
                                                                                                          cookTime: "15 mins",
                                                                                                          servings: 2,
                                                                                                          ingredients: ingredients.map(name => ({ name, amount: getMeasurement(name) })),
                                                                                                          instructions: [
                                                                                                            "Preheat your cooking pan over a medium flame and add your designated cooking oil or butter asset.",
                                                                                                            `Gently organize, slice, and prepare your items: ${ingredients.join(", ")} according to the specific measurements listed above.`,
                                                                                                            "Simmer ingredients together gradually to blend the separate flavor profiles perfectly.",
                                                                                                            "Plate elegantly, garnish with fresh herbs, and serve hot from your AI Kitchen assistant dashboard layout!"
                                                                                                          ]
                                                                                                        });
                                                                                                        setIsPending(false);
                                                                                                      }, 2000);
                                                                                                    };

                                                                                                    return (
                                                                                                      <div className="min-h-screen bg-[#faf8f5] text-slate-800 antialiased p-4 md:p-8">
                                                                                                        <header className="max-w-6xl mx-auto text-center mb-12 pt-6">
                                                                                                          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-2">⚔️ THE AI KITCHEN ⚔️</h1>
                                                                                                          <p className="text-slate-500 font-serif italic text-lg">"Culinary magic from your ingredients"</p>
                                                                                                        </header>

                                                                                                        <main className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 lg:gap-12">
                                                                                                          <section className="lg:col-span-2 space-y-8">
                                                                                                            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border-t-4 border-[#8b263e] relative overflow-hidden">
                                                                                                              <AnimatePresence>
                                                                                                                {isScanning && (
                                                                                                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center text-center p-6">
                                                                                                                    <Loader2 className="w-12 h-12 text-[#8b263e] animate-spin mb-4" />
                                                                                                                    <h4 className="font-serif font-bold text-xl text-[#8b263e]">AI Vision Scanner</h4>
                                                                                                                    <p className="text-sm text-slate-500 mt-1">Extracting ingredients from photo...</p>
                                                                                                                  </motion.div>
                                                                                                                )}
                                                                                                              </AnimatePresence>

                                                                                                              <div className="flex items-center justify-between mb-6">
                                                                                                                <div className="flex items-center gap-3">
                                                                                                                  <div className="p-2 bg-red-50 rounded-full text-[#8b263e]"><ChefHat className="w-6 h-6" /></div>
                                                                                                                  <div>
                                                                                                                    <h2 className="font-serif text-2xl font-bold text-slate-900">Chef's Request</h2>
                                                                                                                    <p className="text-sm text-slate-500">What's in your pantry?</p>
                                                                                                                  </div>
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                  <label htmlFor="fridge-camera" className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-md cursor-pointer border border-amber-200 shadow-sm">
                                                                                                                    <Camera className="w-3.5 h-3.5 text-amber-800" />Scan Fridge
                                                                                                                  </label>
                                                                                                                  <input type="file" id="fridge-camera" accept="image/*" capture="environment" className="hidden" disabled={isPending || isScanning} onChange={() => {
                                                                                                                    setIsScanning(true);
                                                                                                                    setTimeout(() => {
                                                                                                                      setIngredients(prev => Array.from(new Set([...prev, "Eggs", "Milk", "Tomatoes", "Cheese"])));
                                                                                                                      setIsScanning(false);
                                                                                                                    }, 2500);
                                                                                                                  }} />
                                                                                                                </div>
                                                                                                              </div>

                                                                                                              <div className="space-y-4">
                                                                                                                <input type="text" placeholder="Type an ingredient + Press Enter" className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#8b263e] bg-slate-50/50" onKeyDown={(e) => {
                                                                                                                  if (e.key === 'Enter') {
                                                                                                                    const val = (e.target as HTMLInputElement).value.trim();
                                                                                                                    if (val) {
                                                                                                                      setIngredients(prev => Array.from(new Set([...prev, val])));
                                                                                                                      (e.target as HTMLInputElement).value = '';
                                                                                                                    }
                                                                                                                  }
                                                                                                                }} />
                                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                                  {ingredients.map(ing => (
                                                                                                                    <span key={ing} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 text-sm font-medium border rounded-md shadow-sm">
                                                                                                                      {ing}
                                                                                                                      <button onClick={() => setIngredients(prev => prev.filter(i => i !== ing))} className="text-slate-400 hover:text-slate-600 font-bold ml-1">×</button>
                                                                                                                    </span>
                                                                                                                  ))}
                                                                                                                </div>
                                                                                                              </div>

                                                                                                              <div className="mt-8 flex gap-4">
                                                                                                                <button onClick={handleGenerate} disabled={ingredients.length === 0 || isPending || isScanning} className="flex-1 py-3 px-6 rounded-md font-serif font-bold text-lg bg-[#8b263e] text-white shadow-lg shadow-red-900/10 hover:bg-[#721f33] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                                                                                                                  {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Cooking...</span></> : <><Sparkles className="w-5 h-5" /><span>Create Menu</span></>}
                                                                                                                </button>
                                                                                                                {ingredients.length > 0 && (
                                                                                                                  <button onClick={() => { setIngredients([]); setRecipe(null); }} disabled={isPending || isScanning} className="px-4 py-3 rounded-md border border-slate-200 text-slate-700 font-serif hover:bg-slate-50">Clear</button>
                                                                                                                )}
                                                                                                              </div>
                                                                                                            </div>
                                                                                                          </section>

                                                                                                          <section className="lg:col-span-3 min-h-[500px] flex flex-col">
                                                                                                            <AnimatePresence mode="wait">
                                                                                                              {isPending ? (
                                                                                                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white border border-slate-100 rounded-sm shadow-sm">
                                                                                                                  <ChefHat className="w-24 h-24 text-[#8b263e] mb-4 animate-bounce" />
                                                                                                                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">The Kitchen is Busy</h3>
                                                                                                                  <p className="text-slate-500 font-serif italic text-lg">Our AI chefs are crafting your custom menu recipe...</p>
                                                                                                                </motion.div>
                                                                                                              ) : recipe ? (
                                                                                                                <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-slate-100">
                                                                                                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4 mb-4">
                                                                                                                    <div>
                                                                                                                      <span className="text-xs font-serif uppercase tracking-wider text-slate-400 font-semibold">{recipe.title}</span>
                                                                                                                      <h2 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">{recipe.dishName}</h2>
                                                                                                                    </div>
                                                                                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-sm font-medium border shadow-sm">
                                                                                                                      <span className="text-xs font-semibold text-slate-400">🌍</span>
                                                                                                                      <span>{recipe.originCountry}</span>
                                                                                                                    </div>
                                                                                                                  </div>

                                                                                                                  <p className="text-slate-600 italic mb-6 font-serif">{recipe.description}</p>

                                                                                                                  <div className="flex gap-6 mb-6 text-sm bg-slate-50 p-3 rounded-md border text-slate-600 font-serif">
                                                                                                                    <div>⏱️ Prep: <strong>{recipe.prepTime}</strong></div>
                                                                                                                    <div>🍳 Cook: <strong>{recipe.cookTime}</strong></div>
                                                                                                                    <div>👥 Servings: <strong>{recipe.servings}</strong></div>
                                                                                                                  </div>

                                                                                                                  <div className="mb-6">
                                                                                                                    <h4 className="font-serif font-bold text-lg mb-2 border-b pb-1 text-[#8b263e]">Measurements Plotted:</h4>
                                                                                                                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-sm font-serif italic">
                                                                                                                      {recipe.ingredients.map((ing, i) => (
