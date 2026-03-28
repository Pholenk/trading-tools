import { render, screen, fireEvent } from "@testing-library/react";
import PublicLayout from "@/app/(public)/layout";

// ─── Navigation mocks ────────────────────────────────────────────────────────
const mockPush = jest.fn();
let mockPathname = "/";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: mockPush }),
}));

// ─── PageHeader mock ─────────────────────────────────────────────────────────
jest.mock("@/organisms", () => ({
  PageHeader: ({
    tabs,
    activeTab,
    showSearch,
    onTabChange,
  }: {
    tabs: { href: string; label: string }[];
    activeTab?: string;
    showSearch?: boolean;
    onTabChange?: (href: string) => void;
  }) => (
    <div data-testid="page-header" data-show-search={String(showSearch)}>
      <span data-testid="active-tab">{activeTab ?? "none"}</span>
      {tabs.map((tab) => (
        <button
          key={tab.href}
          data-testid={`tab-${tab.label.toLowerCase()}`}
          onClick={() => onTabChange?.(tab.href)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────
function renderLayout(pathname = "/") {
  mockPathname = pathname;
  return render(
    <PublicLayout>
      <div data-testid="children">page content</div>
    </PublicLayout>
  );
}

// ─── Suite ───────────────────────────────────────────────────────────────────
describe("PublicLayout", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockPathname = "/";
  });

  // ── Smoke ──────────────────────────────────────────────────────────────────
  it("renders without crashing", () => {
    renderLayout();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
  });

  it("renders children", () => {
    renderLayout();
    expect(screen.getByTestId("children")).toBeInTheDocument();
  });

  // ── showSearch behaviour ───────────────────────────────────────────────────
  it("passes showSearch=false to PageHeader on the home route (/)", () => {
    renderLayout("/");
    expect(screen.getByTestId("page-header")).toHaveAttribute(
      "data-show-search",
      "false"
    );
  });

  it("passes showSearch=true to PageHeader on non-home routes", () => {
    renderLayout("/sector-rotation");
    expect(screen.getByTestId("page-header")).toHaveAttribute(
      "data-show-search",
      "true"
    );
  });

  it("passes showSearch=true on /wave-count", () => {
    renderLayout("/wave-count");
    expect(screen.getByTestId("page-header")).toHaveAttribute(
      "data-show-search",
      "true"
    );
  });

  // ── Active tab detection ───────────────────────────────────────────────────
  it("sets no active tab on the home route", () => {
    renderLayout("/");
    expect(screen.getByTestId("active-tab").textContent).toBe("none");
  });

  it("sets activeTab=Rotation when pathname is /sector-rotation", () => {
    renderLayout("/sector-rotation");
    expect(screen.getByTestId("active-tab").textContent).toBe("Rotation");
  });

  it("sets activeTab=Wave when pathname is /wave-count", () => {
    renderLayout("/wave-count");
    expect(screen.getByTestId("active-tab").textContent).toBe("Wave");
  });

  it("sets activeTab=Calculator when pathname is /calculator", () => {
    renderLayout("/calculator");
    expect(screen.getByTestId("active-tab").textContent).toBe("Calculator");
  });

  it("sets activeTab=Rotation on a nested path like /sector-rotation/detail", () => {
    renderLayout("/sector-rotation/detail");
    expect(screen.getByTestId("active-tab").textContent).toBe("Rotation");
  });

  // ── Navigation ─────────────────────────────────────────────────────────────
  it("calls router.push with the correct href when a tab is clicked", () => {
    renderLayout("/");
    fireEvent.click(screen.getByTestId("tab-rotation"));
    expect(mockPush).toHaveBeenCalledWith("/sector-rotation");
  });

  it("navigates to /wave-count when Wave tab is clicked", () => {
    renderLayout("/");
    fireEvent.click(screen.getByTestId("tab-wave"));
    expect(mockPush).toHaveBeenCalledWith("/wave-count");
  });

  it("navigates to /calculator when Calculator tab is clicked", () => {
    renderLayout("/");
    fireEvent.click(screen.getByTestId("tab-calculator"));
    expect(mockPush).toHaveBeenCalledWith("/calculator");
  });

  // ── Layout structure ────────────────────────────────────────────────────────
  it("root element has flex-col and min-h-screen classes", () => {
    const { container } = renderLayout();
    expect(container.firstChild).toHaveClass("flex-col", "min-h-screen", "w-full", "bg-surface");
  });

  it("children are rendered inside a flex-1 wrapper", () => {
    const { container } = renderLayout();
    const childWrapper = container.querySelector(".flex-1");
    expect(childWrapper).toBeInTheDocument();
    expect(childWrapper).toContainElement(screen.getByTestId("children"));
  });

  // ── NAV_ITEMS forwarded ─────────────────────────────────────────────────────
  it("passes all three nav items to PageHeader", () => {
    renderLayout();
    expect(screen.getByTestId("tab-rotation")).toBeInTheDocument();
    expect(screen.getByTestId("tab-wave")).toBeInTheDocument();
    expect(screen.getByTestId("tab-calculator")).toBeInTheDocument();
  });
});
