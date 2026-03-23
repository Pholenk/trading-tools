import { render, screen, fireEvent } from "@testing-library/react";
import { Menu } from "@/components/molecules/Menu";

// Mock next-themes for ThemeToggle
const mockSetTheme = jest.fn();
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: mockSetTheme,
  }),
}));

// Force ThemeToggle to mount immediately
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

const TABS = [
  { label: "Rotation" },
  { label: "Wave" },
  { label: "Calculator" },
];

describe("Menu", () => {
  beforeEach(() => mockSetTheme.mockClear());

  it("renders all tab labels", () => {
    render(<Menu tabs={TABS} />);
    expect(screen.getByRole("tab", { name: "Rotation" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Wave" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Calculator" })).toBeInTheDocument();
  });

  it("renders a tablist landmark", () => {
    render(<Menu tabs={TABS} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("activates the first tab by default (uncontrolled)", () => {
    render(<Menu tabs={TABS} />);
    expect(screen.getByRole("tab", { name: "Rotation" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Wave" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("activates defaultActive tab in uncontrolled mode", () => {
    render(<Menu tabs={TABS} defaultActive="Wave" />);
    expect(screen.getByRole("tab", { name: "Wave" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Rotation" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("changes active tab on click in uncontrolled mode", () => {
    render(<Menu tabs={TABS} />);
    fireEvent.click(screen.getByRole("tab", { name: "Calculator" }));
    expect(screen.getByRole("tab", { name: "Calculator" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Rotation" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("calls onTabChange with the tab label when a tab is clicked", () => {
    const handleChange = jest.fn();
    render(<Menu tabs={TABS} onTabChange={handleChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Wave" }));
    expect(handleChange).toHaveBeenCalledWith("Wave");
  });

  it("respects controlled activeTab prop", () => {
    render(<Menu tabs={TABS} activeTab="Calculator" onTabChange={jest.fn()} />);
    expect(screen.getByRole("tab", { name: "Calculator" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("renders the ThemeToggle when showThemeToggle=true (default)", () => {
    render(<Menu tabs={TABS} />);
    expect(
      screen.getByRole("button", { name: /switch to dark theme/i })
    ).toBeInTheDocument();
  });

  it("hides the ThemeToggle when showThemeToggle=false", () => {
    render(<Menu tabs={TABS} showThemeToggle={false} />);
    expect(
      screen.queryByRole("button", { name: /switch to dark theme/i })
    ).not.toBeInTheDocument();
  });

  it("applies custom className to the nav element", () => {
    render(<Menu tabs={TABS} className="custom-menu" />);
    expect(screen.getByRole("tablist")).toHaveClass("custom-menu");
  });
});
