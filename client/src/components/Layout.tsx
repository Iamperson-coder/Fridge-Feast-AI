import { Link, useLocation } from "wouter";
import { UtensilsCrossed, ChefHat, History, Home } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header / Nav */}
      <header className="w-full max-w-5xl mx-auto p-6 md:p-8 flex flex-col items-center border-b-2 border-primary/10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <UtensilsCrossed className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary tracking-wider uppercase">
            The AI Kitchen
          </h1>
          <UtensilsCrossed className="w-8 h-8 text-primary scale-x-[-1]" />
        </div>
        <p className="text-muted-foreground italic font-serif text-lg">
          "Culinary magic from your ingredients"
        </p>

        <nav className="mt-8 flex gap-6 md:gap-12">
          <Link href="/">
            <button 
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                font-serif text-lg
                ${isActive("/") 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "text-foreground hover:text-primary hover:bg-primary/5"}
              `}
            >
              <ChefHat className="w-5 h-5" />
              <span>Chef's Table</span>
            </button>
          </Link>
          <Link href="/history">
            <button 
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                font-serif text-lg
                ${isActive("/history") 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "text-foreground hover:text-primary hover:bg-primary/5"}
              `}
            >
              <History className="w-5 h-5" />
              <span>Past Orders</span>
            </button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl px-4 md:px-6 pb-16 flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-primary/5 border-t border-primary/10 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-6 text-center text-muted-foreground font-serif text-sm">
          <p>&copy; {new Date().getFullYear()} The AI Kitchen. Bon Appétit.</p>
        </div>
      </footer>
    </div>
  );
}
