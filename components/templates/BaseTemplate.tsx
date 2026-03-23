import { Navbar, Footer } from "@/components/organisms";
import type { NavItem } from "@/components/organisms";
import { cn } from "@/lib/utils";

export interface BaseTemplateProps {
  brand: string;
  navItems: NavItem[];
  footerTagline?: string;
  children: React.ReactNode;
  /** Optional extra classes for the <main> wrapper */
  mainClassName?: string;
}

/**
 * BaseTemplate — pure presentational layout shell.
 * Contains Navbar + main content area + Footer.
 * No logic, no Redux — all wiring happens in the corresponding Page component.
 */
export function BaseTemplate({
  brand,
  navItems,
  footerTagline,
  children,
  mainClassName,
}: BaseTemplateProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar brand={brand} navItems={navItems} />

      <main
        id="main-content"
        className={cn("flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8", mainClassName)}
      >
        {children}
      </main>

      <Footer brand={brand} tagline={footerTagline} />
    </div>
  );
}
