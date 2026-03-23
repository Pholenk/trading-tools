import { render, screen } from "@testing-library/react";
import { BaseTemplate } from "@/components/templates/BaseTemplate";

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

const NAV_ITEMS = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About" },
];

describe("BaseTemplate", () => {
  it("renders children inside main", () => {
    render(
      <BaseTemplate brand="TestApp" navItems={NAV_ITEMS}>
        <p>Page content here</p>
      </BaseTemplate>
    );
    expect(screen.getByText("Page content here")).toBeInTheDocument();
  });

  it("renders the Navbar with brand name", () => {
    render(
      <BaseTemplate brand="TestApp" navItems={NAV_ITEMS}>
        <p>Content</p>
      </BaseTemplate>
    );
    expect(screen.getByText("TestApp")).toBeInTheDocument();
  });

  it("renders the Footer", () => {
    render(
      <BaseTemplate brand="TestApp" navItems={NAV_ITEMS} footerTagline="My tagline">
        <p>Content</p>
      </BaseTemplate>
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("My tagline")).toBeInTheDocument();
  });

  it("renders a main landmark element with correct id", () => {
    render(
      <BaseTemplate brand="TestApp" navItems={NAV_ITEMS}>
        <p>Content</p>
      </BaseTemplate>
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("applies mainClassName to the main element", () => {
    render(
      <BaseTemplate
        brand="TestApp"
        navItems={NAV_ITEMS}
        mainClassName="custom-main"
      >
        <p>Content</p>
      </BaseTemplate>
    );
    expect(screen.getByRole("main")).toHaveClass("custom-main");
  });
});
