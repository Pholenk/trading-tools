import { Typography, Button, Badge } from "@/components/atoms";
import { BaseTemplate } from "./BaseTemplate";
import type { NavItem } from "@/components/organisms";

export interface HomeTemplateProps {
  brand: string;
  navItems: NavItem[];
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeLabel?: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

/**
 * HomeTemplate — pure UI for the landing / home page.
 * All click handlers and data are injected from the HomePage HOC.
 */
export function HomeTemplate({
  brand,
  navItems,
  heroTitle,
  heroSubtitle,
  heroBadgeLabel,
  heroPrimaryLabel,
  heroSecondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
}: HomeTemplateProps) {
  return (
    <BaseTemplate
      brand={brand}
      navItems={navItems}
      footerTagline="Built with Next.js & Material You"
      mainClassName="flex items-center justify-center"
    >
      {/* Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="flex flex-col items-center text-center gap-6 py-16 sm:py-24"
      >
        {heroBadgeLabel && (
          <Badge variant="secondary" className="mb-2">
            {heroBadgeLabel}
          </Badge>
        )}

        <Typography
          id="hero-heading"
          variant="display-small"
          as="h1"
          className="text-foreground max-w-3xl"
        >
          {heroTitle}
        </Typography>

        <Typography
          variant="body-large"
          as="p"
          className="text-muted-foreground max-w-xl"
        >
          {heroSubtitle}
        </Typography>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <Button size="lg" onClick={onPrimaryClick}>
            {heroPrimaryLabel}
          </Button>
          <Button size="lg" variant="outlined" onClick={onSecondaryClick}>
            {heroSecondaryLabel}
          </Button>
        </div>
      </section>
    </BaseTemplate>
  );
}
