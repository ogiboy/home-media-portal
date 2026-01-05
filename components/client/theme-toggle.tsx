"use client";

import { useCallback } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

type ThemeToggleProps = Readonly<{
  label: string;
}>;

// Read the current theme from the document root.
const getCurrentTheme = (): Theme => {
  if (typeof document === "undefined") {
    return "light";
  }
  const current = document.documentElement.dataset.theme;
  return current === "dark" ? "dark" : "light";
};

// Theme toggle button that updates the document dataset.
export default function ThemeToggle({ label }: ThemeToggleProps) {
  const toggleTheme = useCallback(() => {
    if (typeof document === "undefined") {
      return;
    }
    const next: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portal-theme", next);
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <Sun className="theme-icon theme-icon-sun h-4 w-4" />
      <Moon className="theme-icon theme-icon-moon h-4 w-4" />
    </Button>
  );
}
