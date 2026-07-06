                                                                                                                                  import { useState, useEffect } from "react";

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
                                                                                                                                      <div style={{ minHeight: "100vh", backgroundColor: "#faf8f5", color: "#334155", padding: "2rem", fontFamily: "sans-serif" }}>
                                                                                                                                        <header style={{ maxWidth: "1200px", margin: "0 auto 3rem auto", textAlign: "center", paddingTop: "1.5rem" }}>
                                                                                                                                          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>⚔️ THE AI KITCHEN ⚔️</h1>
                                                                                                                                          <p style={{ color: "#64748b", fontStyle: "italic", fontSize: "1.125rem" }}>"Culinary magic from your ingredients"</p>
                                                                                                                                        </header>

                                                                                                                                        <main style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
                                                                                                                                          <section style={{ backgroundColor: "#ffffff", padding: "2rem", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderTop: "4px solid #8b263e", position: "relative" }}>
                                                                                                                                            {isScanning && (
                                                                                                                                              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.95)", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1.5rem" }}>
                                                                                                                                                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#8b263e", marginBottom: "0.5rem" }}>AI Vision Scanner</div>
                                                                                                                                                <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Extracting ingredients from photo...</p>
                                                                                                                                              </div>
                                                                                                                                            )}

                                                                                                                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                                                                                                                                              <div>
                                                                                                                                                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Chef's Request</h2>
                                                                                                                                                <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>What's in your pantry?</p>
                                                                                                                                              </div>
                                                                                                                                              <div>
                                                                                                                                                <label htmlFor="fridge-camera" style={{ display: "inline-block", padding: "0.375rem 0.75rem", backgroundColor: "#ffe4e6", color: "#9f1239", fontSize: "0.75rem", fontWeight: "600", borderRadius: "0.375rem", cursor: "pointer", border: "1px solid #fecdd3" }}>
                                                                                                                                                  📷 Scan Fridge
                                                                                                                                                </label>
                                                                                                                                                <input type="file" id="fridge-camera" accept="image/*" capture="environment" style={{ display: "none" }} disabled={isPending || isScanning} onChange={() => {
                                                                                                                                                  setIsScanning(true);
                                                                                                                                                  setTimeout(() => {
                                                                                                                                                    setIngredients(prev => Array.from(new Set([...prev, "Eggs", "Milk", "Tomatoes", "Cheese"])));
                                                                                                                                                    setIsScanning(false);
                                                                                                                                                  }, 2500);
                                                                                                                                                }} />
                                                                                                                                              </div>
                                                                                                                                            </div>

                                                                                                                                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                                                                                                                              <input type="text" placeholder="Type an ingredient + Press Enter" style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "0.375rem", fontSize: "0.875rem", boxSizing: "border-box" }} onKeyDown={(e) => {
                                                                                                                                                if (e.key === 'Enter') {
                                                                                                                                                  const val = (e.target as HTMLInputElement).value.trim();
                                                                                                                                                  if (val) {
                                                                                                                                                    setIngredients(prev => Array.from(new Set([...prev, val])));
                                                                                                                                                    (e.target as HTMLInputElement).value = '';
                                                                                                                                                  }
                                                                                                                                                }
                                                                                                                                              }} />
                                                                                                                                              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                                                                                                                                {ingredients.map(ing => (
                                                                                                                                                  <span key={ing} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.25rem 0.625rem", backgroundColor: "#f1f5f9", color: "#334155", fontSize: "0.875rem", fontWeight: "500", border: "1px solid #e2e8f0", borderRadius: "0.375rem" }}>
                                                                                                                                                    {ing}
                                                                                                                                                    <button onClick={() => setIngredients(prev => prev.filter(i => i !== ing))} style={{ border: "none", background: "none", color: "#94a3b8", fontWeight: "bold", cursor: "pointer", padding: 0 }}>×</button>
                                                                                                                                                  </span>
                                                                                                                                                ))}
                                                                                                                                              </div>
                                                                                                                                            </div>

                                                                                                                                            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                                                                                                                                              <button onClick={handleGenerate} disabled={ingredients.length === 0 || isPending || isScanning} style={{ flex: 1, padding: "0.75rem 1.5rem", borderRadius: "0.375rem", fontWeight: "bold", fontSize: "1.125rem", backgroundColor: "#8b263e", color: "#ffffff", border: "none", cursor: "pointer", opacity: ingredients.length === 0 || isPending || isScanning ? 0.5 : 1 }}>
                                                                                                                                                {isPending ? "Cooking..." : "✨ Create Menu"}
                                                                                                                                              </button>
                                                                                                                                              {ingredients.length > 0 && (
                                                                                                                                                <button onClick={() => { setIngredients([]); setRecipe(null); }} disabled={isPending || isScanning} style={{ padding: "0.75rem 1rem", borderRadius: "0.375rem", border: "1px solid #cbd5e1", backgroundColor: "transparent", color: "#475569", cursor: "pointer" }}>Clear</button>
                                                                                                                                              )}
                                                                                                                                            </div>
                                                                                                                                          </section>

                                                                                                                                          <section style={{ display: "flex", flexDirection: "column" }}>
                                                                                                                                            {isPending ? (
                                                                                                                                              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "4px", textAlign: "center" }}>
                                                                                                                                                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>The Kitchen is Busy</h3>
                                                                                                                                                <p style={{ color: "#64748b", fontStyle: "italic" }}>Our AI chefs are crafting your custom menu recipe...</p>
                                                                                                                                              </div>
                                                                                                                                            ) : recipe ? (
                                                                                                                                              <div style={{ backgroundColor: "#ffffff", padding: "2rem", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                                                                                                                                                <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                                                                                                                                                  <div>
                                                                                                                                                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#94a3b8", fontWeight: "600" }}>{recipe.title}</span>
                                                                                                                                                    <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a", marginTop: "0.125rem", marginBottom: 0 }}>{recipe.dishName}</h2>
                                                                                                                                                  </div>
                                                                                                                                                  <div style={{ padding: "0.25rem 0.75rem", backgroundColor: "#f1f5f9", borderRadius: "9999px", color: "#475569", fontSize: "0.875rem", fontWeight: "500", border: "1px solid #e2e8f0" }}>
                                                                                                                                                    🌍 {recipe.originCountry}
                                                                                                                                                  </div>
                                                                                                                                                </div>

                                                                                                                                                <p style={{ color: "#475569", fontStyle: "italic", marginBottom: "1.5rem" }}>{recipe.description}</p>

                                                                                                                                                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem", fontSize: "0.875rem", backgroundColor: "#f8fafc", padding: "0.75rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0", color: "#475569" }}>
                                                                                                                                                  <div>⏱️ Prep: <strong>{recipe.prepTime}</strong></div>
                                                                                                                                                  <div>🍳 Cook: <strong>{recipe.cookTime}</strong></div>
                                                                                                                                                  <div>👥 Servings: <strong>{recipe.servings}</strong></div>
                                                                                                                                                </div>

                                                                                                                                                <div style={{ marginBottom: "1.5rem" }}>
