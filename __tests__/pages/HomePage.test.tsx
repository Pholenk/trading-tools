import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { HomePage } from "@/components/pages/HomePage";
import themeReducer from "@/store/slices/themeSlice";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: mockPush }),
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

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({ reducer: { theme: themeReducer } });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("HomePage (Page HOC)", () => {
  beforeEach(() => mockPush.mockClear());

  it("renders without crashing", () => {
    renderWithStore(<HomePage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the hero heading", () => {
    renderWithStore(<HomePage />);
    expect(
      screen.getByRole("heading", { name: /build something remarkable/i })
    ).toBeInTheDocument();
  });

  it("renders the brand in the navbar", () => {
    renderWithStore(<HomePage />);
    expect(screen.getByText("My App")).toBeInTheDocument();
  });

  it("navigates to /about when primary CTA is clicked", () => {
    renderWithStore(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: /get started/i }));
    expect(mockPush).toHaveBeenCalledWith("/about");
  });

  it("navigates to /contact when secondary CTA is clicked", () => {
    renderWithStore(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: /learn more/i }));
    expect(mockPush).toHaveBeenCalledWith("/contact");
  });

  it("renders all nav links (desktop + mobile, menu open via mock)", () => {
    renderWithStore(<HomePage />);
    // Each link appears in both desktop nav and mobile drawer
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(2);
  });

  it("renders with a dark theme store state without crashing", () => {
    const store = configureStore({
      reducer: { theme: themeReducer },
      preloadedState: { theme: { mode: "dark" as const } },
    });
    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );
    expect(
      screen.getByRole("heading", { name: /build something remarkable/i })
    ).toBeInTheDocument();
  });
});
