import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "@/components/organisms/Navbar";

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

// The React mock forces mounted=true so ThemeToggle renders immediately.
// It also forces menuOpen to start as true (useState(false) → [true, ...]).
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
  { href: "/contact", label: "Contact" },
];

describe("Navbar", () => {
  it("renders the brand name", () => {
    render(<Navbar brand="TestApp" navItems={NAV_ITEMS} />);
    expect(screen.getByText("TestApp")).toBeInTheDocument();
  });

  it("renders nav links (desktop + mobile)", () => {
    render(<Navbar brand="TestApp" navItems={NAV_ITEMS} />);
    // Both desktop nav and mobile drawer render, so we get 2 of each
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(2);
  });

  it("renders the theme toggle button", () => {
    render(<Navbar brand="TestApp" navItems={NAV_ITEMS} />);
    expect(
      screen.getByRole("button", { name: /switch to dark theme/i })
    ).toBeInTheDocument();
  });

  it("renders the mobile menu toggle button (starts open due to test mock)", () => {
    render(<Navbar brand="TestApp" navItems={NAV_ITEMS} />);
    // With our React mock, useState(false) returns true, so menu starts open
    expect(
      screen.getByRole("button", { name: /close menu/i })
    ).toBeInTheDocument();
  });

  it("has correct aria-expanded=true when menu is open (mock default)", () => {
    render(<Navbar brand="TestApp" navItems={NAV_ITEMS} />);
    const closeBtn = screen.getByRole("button", { name: /close menu/i });
    expect(closeBtn).toHaveAttribute("aria-expanded", "true");
  });

  it("renders nav with accessible landmark", () => {
    render(<Navbar brand="TestApp" navItems={NAV_ITEMS} />);
    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeInTheDocument();
  });

  it("renders the mobile menu drawer when open", () => {
    render(<Navbar brand="TestApp" navItems={NAV_ITEMS} />);
    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
    // Mobile drawer is visible (menu starts open)
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();
  });
});
