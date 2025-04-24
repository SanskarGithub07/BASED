import { Link, NavLink } from "react-router-dom";
import { Menu, X, Sun, Moon, ShoppingCart } from "lucide-react"; // Import ShoppingCart icon
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const location = useLocation();
  const navLinks = [
    { name: "Home", path: location.pathname === "/login" ? "/" : "/dashboard" },
    { name: "Books", path: location.pathname === "/login" ? "/" : "/books/search"},
  ];
  

  return (
    <header className="sticky top-0 z-50 border-b bg-white/50 dark:bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
          SE Project
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Cart Button for Desktop */}
          <Button
            variant="ghost"
            size="icon"
            asChild // Use asChild to allow Link to be the actual button
          >
            <Link to="/cart" aria-label="View Cart"> {/* Added aria-label for accessibility */}
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex gap-2 items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile Cart Button (Next to Theme Toggle) */}
          <Button
            variant="ghost"
            size="icon"
            asChild // Use asChild to allow Link to be the actual button
          >
            <Link to="/cart" aria-label="View Cart"> {/* Added aria-label for accessibility */}
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-4 pb-4 overflow-hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
              {/* Cart Link in Mobile Menu */}
              <NavLink
                to="/cart"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Cart
              </NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}