"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavLinkProps {
  href: string;
  label: string;
  exact?: boolean;
  className?: string;
}

export function NavLink({ href, label, exact = false, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative inline-flex items-center label-large transition-colors px-1 py-0.5",
        "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:transition-all after:duration-200",
        isActive
          ? "text-primary after:w-full after:bg-primary"
          : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full hover:after:bg-outline",
        className
      )}
    >
      {label}
    </Link>
  );
}
