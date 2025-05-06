
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col md:h-16 md:flex-row items-center justify-between gap-4 md:gap-0">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CryptoOracle. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
