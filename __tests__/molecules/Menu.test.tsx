import { render, screen } from "@testing-library/react";
import { Menu } from "@/components/molecules";

const mockSetTheme = jest.fn();
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: mockSetTheme,
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

const TABS = [
  { href: '/setor-rotation', label: 'Rotation' },
  { href: '/wave-count', label: 'Wave' },
  { href: '/calculator', label: 'Calculator' },
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

  it("activates defaultActive tab in uncontrolled mode", () => {
    render(<Menu tabs={TABS} defaultActive="Wave" />);
    expect(screen.getByRole("tab", { name: "Wave" })).toHaveAttribute(
      "aria-selected", "true"
    );
    expect(screen.getByRole("tab", { name: "Rotation" })).toHaveAttribute(
      "aria-selected", "false"
    );
  });

  it("respects controlled activeTab prop", () => {
    render(<Menu tabs={TABS} activeTab="Calculator" onTabChange={jest.fn()} />);
    expect(screen.getByRole("tab", { name: "Calculator" })).toHaveAttribute(
      "aria-selected", "true"
    );
  });

  it("renders ButtonIcon at the end when showButtonIcon=true (default)", () => {
    render(<Menu tabs={TABS} />);
    expect(
      screen.getByRole("button", { name: /switch to dark theme/i })
    ).toBeInTheDocument();
  });

  it("ButtonIcon is rendered after all tab items", () => {
    render(<Menu tabs={TABS} />);
    const allButtons = screen.getAllByRole("button");
    // Only ButtonIcon is a button; tabs are role="tab" not "button"
    expect(allButtons).toHaveLength(1);
    expect(allButtons[0]).toHaveAttribute("aria-label", expect.stringMatching(/switch to/i));
  });

  it("applies custom className to the nav element", () => {
    render(<Menu tabs={TABS} className="custom-menu" />);
    expect(screen.getByRole("tablist")).toHaveClass("custom-menu");
  });
});
