
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import CryptoLogo from "../3d/CryptoLogo";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <CryptoLogo />
          </div>
          <Link to="/" className="text-xl font-bold">
            Crypto Dashboard
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link to="/prediction" className="text-sm font-medium transition-colors hover:text-primary">
            Predictions
          </Link>
          <Link to="/wallet" className="text-sm font-medium transition-colors hover:text-primary">
            Wallet
          </Link>
          <Link to="/converter" className="text-sm font-medium transition-colors hover:text-primary">
            Converter
          </Link>
          <Link to="/news" className="text-sm font-medium transition-colors hover:text-primary">
            News
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background absolute w-full">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link to="/prediction" className="text-sm font-medium transition-colors hover:text-primary">
              Predictions
            </Link>
            <Link to="/wallet" className="text-sm font-medium transition-colors hover:text-primary">
              Wallet
            </Link>
            <Link to="/converter" className="text-sm font-medium transition-colors hover:text-primary">
              Converter
            </Link>
            <Link to="/news" className="text-sm font-medium transition-colors hover:text-primary">
              News
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
