import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function toggleDarkMode() {
  if (typeof window === "undefined") return;
  
  const root = document.documentElement;
  root.classList.toggle("dark");
  
  if (root.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

export function initTheme() {
  if (typeof window === "undefined") return;
  
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }
}
