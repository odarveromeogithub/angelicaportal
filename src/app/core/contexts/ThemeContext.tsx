import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Public routes that should not have theme styling
const PUBLIC_ROUTES_NO_THEME = ["/login", "/register", "/otp", "/angelica"];

function ThemeProviderContent({ children }: { children: React.ReactNode }) {
  const [theme, setThemePreference] = useLocalStorage<Theme>(
    "theme-preference",
    "system",
  );
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const location = useLocation();

  // Check if current route should have theme applied
  const shouldApplyTheme = !PUBLIC_ROUTES_NO_THEME.some((route) =>
    location.pathname.startsWith(route),
  );

  const applyTheme = (newTheme: Theme) => {
    const htmlElement = document.documentElement;

    let effectiveTheme: "light" | "dark";

    if (newTheme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      effectiveTheme = newTheme;
    }

    if (effectiveTheme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }

    setResolvedTheme(effectiveTheme);
  };

  const removeTheme = () => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove("dark");
    setResolvedTheme("light");
  };

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    // Apply theme if on authenticated routes
    if (shouldApplyTheme) {
      applyTheme(theme);
    } else {
      removeTheme();
    }
  }, [shouldApplyTheme, theme]);

  // Watch for system theme changes
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system" && shouldApplyTheme) {
        applyTheme("system");
      }
    };

    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, [theme, shouldApplyTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemePreference(newTheme);
    if (shouldApplyTheme) {
      applyTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProviderContent>{children}</ThemeProviderContent>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
