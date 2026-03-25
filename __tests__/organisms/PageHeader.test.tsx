import { render, screen, fireEvent } from "@testing-library/react";
import { PageHeader } from "@/components/organisms/PageHeader";

// Mock next-themes for ButtonIcon inside Menu
const mockSetTheme = jest.fn();
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: mockSetTheme,
  }),
}));

// Force mounted state for client components
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

describe("PageHeader", () => {
  beforeEach(() => mockSetTheme.mockClear());

  it("renders without crashing", () => {
    const { container } = render(<PageHeader tabs={TABS} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<PageHeader tabs={TABS} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders the placeholder text", () => {
    render(<PageHeader tabs={TABS} searchPlaceholder="ASII, ADMR, BBCA..." />);
    expect(
      screen.getByPlaceholderText("ASII, ADMR, BBCA...")
    ).toBeInTheDocument();
  });

  it("renders all menu tabs", () => {
    render(<PageHeader tabs={TABS} />);
    expect(screen.getByRole("tab", { name: "Rotation" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Wave" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Calculator" })).toBeInTheDocument();
  });

  it("renders the Divider (hr) at the bottom", () => {
    const { container } = render(<PageHeader tabs={TABS} />);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });

  it("Divider has correct classes", () => {
    const { container } = render(<PageHeader tabs={TABS} />);
    const hr = container.querySelector("hr");
    expect(hr).toHaveClass("w-full", "h-[2px]", "bg-outline-variant");
  });

  it("Divider is the last child in the column", () => {
    const { container } = render(<PageHeader tabs={TABS} />);
    const children = container.firstElementChild?.children;
    const last = children?.[children.length - 1];
    expect(last?.tagName.toLowerCase()).toBe("hr");
  });

  it("renders the ButtonIcon by default", () => {
    render(<PageHeader tabs={TABS} />);
    expect(
      screen.getByRole("button", { name: /switch to dark theme/i })
    ).toBeInTheDocument();
  });

  it("calls onSearchChange when typing in the input", () => {
    const handleSearch = jest.fn();
    render(<PageHeader tabs={TABS} onSearchChange={handleSearch} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "BBCA" },
    });
    expect(handleSearch).toHaveBeenCalledWith("BBCA");
  });

  it("renders with a controlled search value", () => {
    render(<PageHeader tabs={TABS} searchValue="ASII" />);
    expect(
      (screen.getByRole("textbox") as HTMLInputElement).value
    ).toBe("ASII");
  });

  it("fires onTabChange when a tab is clicked", () => {
    const handleTabChange = jest.fn();
    render(<PageHeader tabs={TABS} onTabChange={handleTabChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Wave" }));
    expect(handleTabChange).toHaveBeenCalledWith(TABS[1].href);
  });

  it("respects controlled activeTab", () => {
    render(
      <PageHeader tabs={TABS} activeTab="Calculator" onTabChange={jest.fn()} />
    );
    expect(
      screen.getByRole("tab", { name: "Calculator" })
    ).toHaveAttribute("aria-selected", "true");
  });

  it("respects defaultActiveTab in uncontrolled mode", () => {
    render(<PageHeader tabs={TABS} defaultActiveTab="Wave" />);
    expect(
      screen.getByRole("tab", { name: "Wave" })
    ).toHaveAttribute("aria-selected", "true");
  });

  it("applies w-full to the root element", () => {
    const { container } = render(<PageHeader tabs={TABS} />);
    expect(container.firstChild).toHaveClass("w-full");
  });

  it("applies custom className to the root element", () => {
    const { container } = render(
      <PageHeader tabs={TABS} className="custom-header" />
    );
    expect(container.firstChild).toHaveClass("custom-header");
  });
});
