import { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { IngredientInput } from "@/components/IngredientInput";
import { Camera, Upload, ChefHat, Loader2, ArrowRight, Scroll } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import "./home.css";

interface RecipeSuggestion {
  title: string;
  description: string;
  cuisine: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isGenerating, setIsGenerating] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [_, setLocation] = useLocation();

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPhotoPreview(base64);
      setIsAnalyzing(true);
      try {
        const res = await fetch("/api/analyze-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        const data = await res.json();
        const found: string[] = data.ingredients || [];
        setIngredients(prev => [...new Set([...prev, ...found])]);
      } catch (err) {
        console.error("Photo analysis failed:", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSuggest = async () => {
    if (ingredients.length === 0) return;
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const res = await fetch("/api/recipes/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error("Suggestion failed:", err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSelect = async (suggestion: RecipeSuggestion, idx: number) => {
    if (isGenerating !== null) return;
    setIsGenerating(idx);
    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, selectedRecipe: suggestion }),
      });
      const recipe = await res.json();
      setLocation(`/recipe/${recipe.id}`);
    } catch (err) {
      console.error("Recipe generation failed:", err);
      setIsGenerating(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-10">

        {/* ── Step 1: Ingredients ── */}
        <div className="bg-white paper-shadow p-8 rounded-sm border border-primary/10 relative">
          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/30" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/30" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/30" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/30" />

          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 mb-3 border border-primary text-primary text-xs font-bold uppercase tracking-widest">
              Step 1
            </span>
            <h2 className="text-3xl font-serif font-bold text-primary">
              What's in Your Kitchen?
            </h2>
          </div>

          <div className="ornament-divider mb-6">
            <span>Type your ingredients</span>
          </div>

          <IngredientInput
            ingredients={ingredients}
            onChange={setIngredients}
            disabled={isAnalyzing || isSuggesting || isGenerating !== null}
          />

          {/* Photo Upload */}
          <div className="mt-8">
            <div className="ornament-divider mb-5">
              <span>or scan your fridge / pantry</span>
            </div>

            {/* Hidden inputs */}
            <input
              ref={uploadRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => uploadRef.current?.click()}
                className="
                  flex flex-col items-center gap-2 py-5
                  border-2 border-dashed border-primary/30
                  hover:border-primary hover:bg-primary/5
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200 rounded-sm
                  font-serif text-primary/70 hover:text-primary
                "
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm tracking-wide">Upload Photo</span>
              </button>

              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => cameraRef.current?.click()}
                className="
                  flex flex-col items-center gap-2 py-5
                  border-2 border-dashed border-primary/30
                  hover:border-primary hover:bg-primary/5
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200 rounded-sm
                  font-serif text-primary/70 hover:text-primary
                "
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm tracking-wide">Take Photo</span>
              </button>
            </div>

            {/* Photo preview + scanning overlay */}
            <AnimatePresence>
              {photoPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="relative rounded-sm border border-primary/20 overflow-hidden">
                    <img
                      src={photoPreview}
                      alt="Scanned pantry"
                      className="w-full h-52 object-cover"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-white/85 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-9 h-9 text-primary animate-spin" />
                        <p className="font-serif italic text-primary text-lg">
                          Scanning for ingredients…
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Consult the Chef button ── */}
        <div className="text-center">
          <button
            onClick={handleSuggest}
            disabled={ingredients.length === 0 || isSuggesting || isAnalyzing || isGenerating !== null}
            className="
              inline-flex items-center gap-3 px-10 py-4
              bg-primary text-primary-foreground
              font-serif text-xl font-bold tracking-wider uppercase
              border-4 border-double border-primary-foreground/20
              hover:bg-primary/90
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-300 paper-shadow rounded-sm
            "
          >
            {isSuggesting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Consulting the Chef…
              </>
            ) : (
              <>
                <ChefHat className="w-6 h-6" />
                See Today's Menu
              </>
            )}
          </button>
        </div>

        {/* ── Step 2: Suggestions list ── */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <span className="inline-block px-3 py-1 mb-3 border border-primary text-primary text-xs font-bold uppercase tracking-widest">
                  Step 2
                </span>
                <h2 className="text-3xl font-serif font-bold text-primary">
                  Chef's Recommendations
                </h2>
                <div className="ornament-divider max-w-xs mx-auto mt-2">
                  <span>Select a dish to prepare</span>
                </div>
              </div>

              <div className="space-y-4">
                {suggestions.map((s, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.12 }}
                    onClick={() => handleSelect(s, idx)}
                    className="
                      relative bg-white paper-shadow border border-primary/10
                      hover:border-primary/40 hover:shadow-lg
                      transition-all duration-300 rounded-sm overflow-hidden
                      cursor-pointer group
                    "
                  >
                    {/* Left accent bar */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-300" />

                    <div className="p-6 pl-8 flex items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-primary/60 border border-primary/30 px-2 py-0.5 shrink-0">
                            {s.cuisine}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors truncate pr-2">
                          {s.title}
                        </h3>
                        <p className="font-serif italic text-muted-foreground text-sm leading-relaxed line-clamp-2">
                          {s.description}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {isGenerating === idx ? (
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        ) : (
                          <div className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                            <ArrowRight className="w-5 h-5 text-primary/50 group-hover:text-white transition-colors" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Menu item number */}
                    <div className="absolute bottom-3 right-4 text-xs font-mono text-primary/20 group-hover:text-primary/40 transition-colors">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-center font-serif italic text-muted-foreground/60 text-sm mt-6">
                — Select a dish to see the full recipe &amp; a photo of the finished meal —
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
