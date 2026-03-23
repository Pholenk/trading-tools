"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button, Typography } from "@/components/atoms";
import { ThemeToggle, NavLink } from "@/components/molecules";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

export interface NavbarProps {
  brand: string;
  navItems: NavItem[];
  className?: string;
}

export function Navbar({ brand, navItems, className }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-outline-variant",
        "bg-surface/80 backdrop-blur-md supports-[backdrop-filter]:bg-surface/60",
        className
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Brand */}
        <Link href="/" className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <Typography variant="title-large" as="span" className="text-primary font-semibold">
            {brand}
          </Typography>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6" role="list">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} label={item.label} exact={item.exact} />
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle variant="icon" />

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-outline-variant bg-surface px-4 pb-4"
        >
          <ul className="flex flex-col gap-1 pt-2" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  exact={item.exact}
                  className="w-full py-2"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
