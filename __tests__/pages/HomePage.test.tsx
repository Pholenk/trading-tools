import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Page from "@/app/(public)/page";
import themeReducer from "@/store/slices/themeSlice";

// ─── Router mock ────────────────────────────────────────────────────────────
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: mockPush }),
}));

// ─── Component mocks ────────────────────────────────────────────────────────
/**
 * Mock <HomeTemplate /> so this suite focuses only on the Page (HOC) layer,
 * not on template internals.
 */
jest.mock("@/components/templates", () => ({
  HomeTemplate: () => <div data-testid="home-template">HomeTemplate</div>,
}));

/**
 * Mock <Menu /> so we can:
 *  1. Assert which tabs were forwarded.
 *  2. Trigger onTabChange without needing real UI interaction.
 */
jest.mock("@/components/molecules", () => ({
  Menu: ({
    tabs,
    onTabChange,
  }: {
    tabs: { href: string; label: string }[];
    onTabChange: (href: string) => void;
  }) => (
    <nav data-testid="menu">
      {tabs.map((tab) => (
        <button key={tab.href} data-testid={`tab-${tab.label.toLowerCase()}`} onClick={() => onTabChange(tab.href)}>
          {tab.label}
        </button>
      ))}
    </nav>
  ),
}));

// ─── Helper ─────────────────────────────────────────────────────────────────
function renderWithStore(
  ui: React.ReactElement,
  preloadedState?: { theme: { mode: "light" | "dark" } }
) {
  const store = configureStore({
    reducer: { theme: themeReducer },
    ...(preloadedState ? { preloadedState } : {}),
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

// ─── Suite ──────────────────────────────────────────────────────────────────
describe("Page (HOC layer)", () => {
  beforeEach(() => mockPush.mockClear());

  // ── Smoke ─────────────────────────────────────────────────────────────────
  it("renders without crashing", () => {
    renderWithStore(<Page />);
    // The root element should be present (the wrapping div is the only top-level element)
    expect(screen.getByTestId("home-template")).toBeInTheDocument();
  });

  // ── HomeTemplate ──────────────────────────────────────────────────────────
  it("renders <HomeTemplate />", () => {
    renderWithStore(<Page />);
    expect(screen.getByTestId("home-template")).toBeInTheDocument();
  });

  // ── Menu ──────────────────────────────────────────────────────────────────
  it("renders <Menu /> inside the page", () => {
    renderWithStore(<Page />);
    expect(screen.getByTestId("menu")).toBeInTheDocument();
  });

  it("passes all three NAV_ITEMS to <Menu />", () => {
    renderWithStore(<Page />);
    expect(screen.getByTestId("tab-rotation")).toBeInTheDocument();
    expect(screen.getByTestId("tab-wave")).toBeInTheDocument();
    expect(screen.getByTestId("tab-calculator")).toBeInTheDocument();
  });

  it("displays correct labels for each nav item", () => {
    renderWithStore(<Page />);
    expect(screen.getByText("Rotation")).toBeInTheDocument();
    expect(screen.getByText("Wave")).toBeInTheDocument();
    expect(screen.getByText("Calculator")).toBeInTheDocument();
  });

  // ── Navigation (handleMenuClick) ──────────────────────────────────────────
  it("navigates to /setor-rotation when Rotation tab is clicked", () => {
    renderWithStore(<Page />);
    fireEvent.click(screen.getByTestId("tab-rotation"));
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/setor-rotation");
  });

  it("navigates to /wave-count when Wave tab is clicked", () => {
    renderWithStore(<Page />);
    fireEvent.click(screen.getByTestId("tab-wave"));
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/wave-count");
  });

  it("navigates to /calculator when Calculator tab is clicked", () => {
    renderWithStore(<Page />);
    fireEvent.click(screen.getByTestId("tab-calculator"));
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/calculator");
  });

  it("calls router.push exactly once per tab click", () => {
    renderWithStore(<Page />);
    fireEvent.click(screen.getByTestId("tab-rotation"));
    fireEvent.click(screen.getByTestId("tab-wave"));
    expect(mockPush).toHaveBeenCalledTimes(2);
  });

  // ── Redux / theme ─────────────────────────────────────────────────────────
  it("renders correctly with light theme store state", () => {
    renderWithStore(<Page />, { theme: { mode: "light" } });
    expect(screen.getByTestId("home-template")).toBeInTheDocument();
  });

  it("renders correctly with dark theme store state", () => {
    renderWithStore(<Page />, { theme: { mode: "dark" } });
    expect(screen.getByTestId("home-template")).toBeInTheDocument();
  });

  // ── Layout / CSS classes ──────────────────────────────────────────────────
  it("applies expected Tailwind layout classes to the root container", () => {
    const { container } = renderWithStore(<Page />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("flex");
    expect(root).toHaveClass("flex-col");
    expect(root).toHaveClass("w-full");
    expect(root).toHaveClass("min-h-screen");
    expect(root).toHaveClass("bg-surface");
  });

  it("renders Menu inside a right-aligned wrapper", () => {
    const { container } = renderWithStore(<Page />);
    // The menu wrapper is the first child of the root container
    const menuWrapper = container.querySelector(".flex.justify-end");
    expect(menuWrapper).toBeInTheDocument();
    expect(menuWrapper).toContainElement(screen.getByTestId("menu"));
  });
});
