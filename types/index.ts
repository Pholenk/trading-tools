// ─── Theme ─────────────────────────────────────────────────────────────────
export type ThemeMode = "light" | "dark" | "system";

// ─── Navigation ────────────────────────────────────────────────────────────
export interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

// ─── SEO / Metadata helpers ────────────────────────────────────────────────
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

// ─── Generic utility types ──────────────────────────────────────────────────

/** Makes every property in T optional recursively */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Extract the props of a React component */
export type PropsOf<C extends React.ElementType> =
  React.ComponentPropsWithoutRef<C>;

/** Children prop shorthand */
export type WithChildren<T = Record<string, never>> = T & {
  children: React.ReactNode;
};

/** Optional children prop shorthand */
export type WithOptionalChildren<T = Record<string, never>> = T & {
  children?: React.ReactNode;
};

/** className prop shorthand */
export type WithClassName<T = Record<string, never>> = T & {
  className?: string;
};
