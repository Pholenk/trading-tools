"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useAppDispatch } from "@/store/hooks";
import { setTheme, type ThemeMode } from "@/store/slices/themeSlice";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/** Inner component: syncs next-themes resolved theme → Redux */
function ThemeSyncer() {
  const { resolvedTheme, theme } = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const current = (theme as ThemeMode) ?? "system";
    dispatch(setTheme(current));
  }, [resolvedTheme, theme, dispatch]);

  return null;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ThemeSyncer />
      {children}
    </NextThemesProvider>
  );
}
