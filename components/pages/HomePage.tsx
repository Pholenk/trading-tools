"use client";

import { useRouter } from "next/navigation";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { useAppSelector } from "@/store/hooks";

const NAV_ITEMS = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * HomePage — Page (HOC) layer.
 * All business logic, routing, Redux connections live here.
 * Renders <HomeTemplate /> with pure props — no logic in the template.
 */
export function HomePage() {
  const router = useRouter();
  // Example: read theme from Redux (could gate behaviour on it)
  const themeMode = useAppSelector((s) => s.theme.mode);
  void themeMode; // available for conditional logic as needed

  const handlePrimaryClick = () => {
    router.push("/about");
  };

  const handleSecondaryClick = () => {
    router.push("/contact");
  };

  return (
    <HomeTemplate
      brand="My App"
      navItems={NAV_ITEMS}
      heroTitle="Build something remarkable"
      heroSubtitle="A production-ready Next.js starter with Material You colours, atomic design, Redux state management, and full dark-mode support."
      heroBadgeLabel="v1.0 — Ready to build"
      heroPrimaryLabel="Get Started"
      heroSecondaryLabel="Learn More"
      onPrimaryClick={handlePrimaryClick}
      onSecondaryClick={handleSecondaryClick}
    />
  );
}
