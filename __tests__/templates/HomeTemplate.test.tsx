import { render, screen, fireEvent } from "@testing-library/react";
import { HomeTemplate } from "@/components/templates/HomeTemplate";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: jest.fn(),
  }),
}));

jest.mock("react", () => {
  const real = jest.requireActual("react");
  return {
    ...real,
    useEffect: (fn: () => void) => fn(),
    useState: (init: unknown) => {
      if (init === false) return [true, jest.fn()];
      return real.useState(init);
    },
  };
});

const baseProps = {
  brand: "TestApp",
  navItems: [{ href: "/", label: "Home", exact: true }],
  heroTitle: "Welcome to TestApp",
  heroSubtitle: "The best app ever built.",
  heroPrimaryLabel: "Get Started",
  heroSecondaryLabel: "Learn More",
  onPrimaryClick: jest.fn(),
  onSecondaryClick: jest.fn(),
};

describe("HomeTemplate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the hero title", () => {
    render(<HomeTemplate {...baseProps} />);
    expect(screen.getByText("Welcome to TestApp")).toBeInTheDocument();
  });

  it("renders the hero subtitle", () => {
    render(<HomeTemplate {...baseProps} />);
    expect(screen.getByText("The best app ever built.")).toBeInTheDocument();
  });

  it("renders the primary CTA button", () => {
    render(<HomeTemplate {...baseProps} />);
    expect(screen.getByRole("button", { name: /get started/i })).toBeInTheDocument();
  });

  it("renders the secondary CTA button", () => {
    render(<HomeTemplate {...baseProps} />);
    expect(screen.getByRole("button", { name: /learn more/i })).toBeInTheDocument();
  });

  it("calls onPrimaryClick when primary CTA is clicked", () => {
    render(<HomeTemplate {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: /get started/i }));
    expect(baseProps.onPrimaryClick).toHaveBeenCalledTimes(1);
  });

  it("calls onSecondaryClick when secondary CTA is clicked", () => {
    render(<HomeTemplate {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: /learn more/i }));
    expect(baseProps.onSecondaryClick).toHaveBeenCalledTimes(1);
  });

  it("renders the badge when heroBadgeLabel is provided", () => {
    render(<HomeTemplate {...baseProps} heroBadgeLabel="v1.0 — New" />);
    expect(screen.getByText("v1.0 — New")).toBeInTheDocument();
  });

  it("does not render the badge when heroBadgeLabel is omitted", () => {
    render(<HomeTemplate {...baseProps} />);
    expect(screen.queryByText(/v1.0/)).not.toBeInTheDocument();
  });

  it("renders hero section as a labelled region", () => {
    render(<HomeTemplate {...baseProps} />);
    // The section is labelled by the hero heading text
    expect(
      screen.getByRole("region", { name: /welcome to testapp/i })
    ).toBeInTheDocument();
  });
});
