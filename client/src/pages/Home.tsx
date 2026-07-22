import React, { useState } from "react";
import "./home.css"; // Ensure your Tailwind directives or styles are in this file

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    setRecipe("");

    try {
      // Replace with your actual backend API URL if needed
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();
      setRecipe(data.recipe || "No recipe found. Try different ingredients!");
    } catch (error) {
      console.error("Error generating recipe:", error);
      setRecipe("Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-800 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-emerald-700 tracking-tight mb-2">
            🍳 Fridge Feast AI
          </h1>
          <p className="text-gray-600">
            Tell us what is in your fridge, and we will create a recipe!
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter your ingredients (separated by commas):
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Eggs, tomatoes, spinach, cheese..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            {loading ? "Chef AI is cooking up ideas..." : "Generate Recipe ✨"}
          </button>
        </form>

        {/* Recipe Output Display */}
        {recipe && (
          <div className="mt-8 p-6 bg-emerald-50 rounded-xl border border-emerald-200 animate-fadeIn">
            <h2 className="text-xl font-bold text-emerald-800 mb-3 flex items-center gap-2">
              🍽️ Your AI Recipe:
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {recipe}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
