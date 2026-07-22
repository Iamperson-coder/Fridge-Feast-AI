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

                                                                                                                                                    // NEW: State to store the uploaded image file or preview URL
                                                                                                                                                    const [selectedImage, setSelectedImage] = useState<File | null>(null);
                                                                                                                                                    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

                                                                                                                                                    // NEW: Function to handle picking an image file
                                                                                                                                                    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                                                                                                                                      if (e.target.files && e.target.files[0]) {
                                                                                                                                                        const file = e.target.files[0];
                                                                                                                                                        setSelectedImage(file);
                                                                                                                                                        setImagePreview(URL.createObjectURL(file)); // Creates a link to display the image preview

                                                                                                                                                        // Simulating AI scanner reading ingredients from the image
                                                                                                                                                        setIsScanning(true);
                                                                                                                                                        setTimeout(() => {
                                                                                                                                                          // Automatically adds some mock ingredients found in the photo
                                                                                                                                                          const scannedIngredients = ["Tomatoes", "Cheese", "Chicken"];
                                                                                                                                                          setIngredients((prev) => {
                                                                                                                                                            const combined = [...prev, ...scannedIngredients];
                                                                                                                                                            return Array.from(new Set(combined)); // Removes any duplicates
                                                                                                                                                          });
                                                                                                                                                          setIsScanning(false);
                                                                                                                                                        }, 2000); // 2-second scan delay
                                                                                                                                                      }
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
                                                                                                                                                          ingredients: ingredients.map(ing => ({ name: ing, amount: getMeasurement(ing) })),
                                                                                                                                                          instructions: [
                                                                                                                                                            "Prep your ingredients and wash thoroughly.",
                                                                                                                                                            "Combine items together in a heated skillet.",
                                                                                                                                                            "Season to taste and serve warm."
                                                                                                                                                          ]
                                                                                                                                                        });
                                                                                                                                                        setIsPending(false);
                                                                                                                                                      }, 1500);
                                                                                                                                                    };

                                                                                                                                                    return (
                                                                                                                                                      <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px", margin: "auto" }}>
                                                                                                                                                        <h1>Fridge Feast AI 🍳</h1>

                                                                                                                                                        {/* IMAGE UPLOAD SECTION */}
                                                                                                                                                        <div style={{ border: "2px dashed #ccc", padding: "20px", borderRadius: "8px", textAlign: "center", marginBottom: "20px" }}>
                                                                                                                                                          <h3>📸 Upload Photo of Fridge / Pantry</h3>
                                                                                                                                                          <input 
                                                                                                                                                            type="file" 
                                                                                                                                                            accept="image/*" 
                                                                                                                                                            capture="environment" 
                                                                                                                                                            onChange={handleImageChange} 
                                                                                                                                                            style={{ marginBottom: "10px" }}
                                                                                                                                                          />
                                                                                                                                                          <p style={{ fontSize: "12px", color: "#666" }}>Supports file upload or phone camera snap</p>

                                                                                                                                                          {imagePreview && (
                                                                                                                                                            <div style={{ marginTop: "10px" }}>
                                                                                                                                                              <img src={imagePreview} alt="Fridge Preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "4px" }} />
                                                                                                                                                            </div>
                                                                                                                                                          )}

                                                                                                                                                          {isScanning && <p style={{ color: "blue", fontWeight: "bold" }}>🔄 AI is analyzing your food photo...</p>}
                                                                                                                                                        </div>

                                                                                                                                                        {/* INGREDIENTS LIST CONTAINER */}
                                                                                                                                                        <div style={{ marginBottom: "20px" }}>
                                                                                                                                                          <h3>Your Current Ingredients:</h3>
                                                                                                                                                          {ingredients.length === 0 ? (
                                                                                                                                                            <p>No ingredients listed. Upload a photo or type to add some!</p>
                                                                                                                                                          ) : (
                                                                                                                                                            <ul>
                                                                                                                                                              {ingredients.map((ing, index) => (
                                                                                                                                                                <li key={index}>{ing}</li>
                                                                                                                                                              ))}
                                                                                                                                                            </ul>
                                                                                                                                                          )}
                                                                                                                                                        </div>

                                                                                                                                                        {/* GENERATE BUTTON */}
                                                                                                                                                        <button 
                                                                                                                                                          onClick={handleGenerate} 
                                                                                                                                                          disabled={ingredients.length === 0 || isPending || isScanning}
                                                                                                                                                          style={{
                                                                                                                                                            padding: "10px 20px",
                                                                                                                                                            backgroundColor: ingredients.length === 0 ? "#ccc" : "#007bff",
                                                                                                                                                            color: "white",
                                                                                                                                                            border: "none",
                                                                                                                                                            borderRadius: "4px",
                                                                                                                                                            cursor: "pointer",
                                                                                                                                                            width: "100%",
                                                                                                                                                            fontWeight: "bold"
                                                                                                                                                          }}
                                                                                                                                                        >
                                                                                                                                                          {isPending ? "👩‍🍳 Crafting Recipe..." : "✨ Generate Recipes"}
                                                                                                                                                        </button>

                                                                                                                                                        {/* RECIPE DISPLAY BOX */}
                                                                                                                                                        {recipe && (
                                                                                                                                                          <div style={{ marginTop: "30px", border: "1px solid #ddd", padding: "20px", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                                                                                                                                                            <h2>{recipe.title}</h2>
                                                                                                                                                            <h4>{recipe.dishName} ({recipe.originCountry})</h4>
                                                                                                                                                            <p><em>{recipe.description}</em></p>
                                                                                                                                                            <p>⏳ Prep: {recipe.prepTime} | 🍳 Cook: {recipe.cookTime} | 🍽️ Servings: {recipe.servings}</p>

                                                                                                                                                            <h5>Ingredients Needed:</h5>
                                                                                                                                                            <ul>
                                                                                                                                                              {recipe.ingredients.map((ing, i) => (
                                                                                                                                                                <li key={i}>{ing.amount} - {ing.name}</li>
                                                                                                                                                              ))}
                                                                                                                                                            </ul>

                                                                                                                                                            <h5>Instructions:</h5>
                                                                                                                                                            <ol>
                                                                                                                                                              {recipe.instructions.map((step, i) => (
                                                                                                                                                                <li key={i} style={{ marginBottom: "8px" }}>{step}</li>
                                                                                                                                                              ))}
                                                                                                                                                            </ol>
                                                                                                                                                          </div>
                                                                                                                                                        )}
                                                                                                                                                      </div>
                                                                                                                                                    );
                                                                                                                                                  }
