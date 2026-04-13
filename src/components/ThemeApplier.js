"use client";

import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

/**
 * Mounts once inside <body> and keeps the <html> element in sync
 * with the current theme. This is the single source of truth for
 * global theming — all CSS variables cascade from [data-theme] on <html>.
 */
export default function ThemeApplier() {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement; // <html>
    root.setAttribute("data-theme", theme);
    // Also set color-scheme so browser UI (scrollbars, inputs) matches
    root.style.colorScheme = theme;
  }, [theme]);

  return null; // renders nothing
}