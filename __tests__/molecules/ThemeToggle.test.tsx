import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/molecules";

// Mock next-themes
const mockSetTheme = jest.fn();
let mockTheme = "light";
let mockResolved = "light";

jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: mockTheme,
    resolvedTheme: mockResolved,
    setTheme: mockSetTheme,
  }),
}));

// Suppress the mounted guard by always rendering
jest.mock("react", () => {
  const real = jest.requireActual("react");
  return {
    ...real,
    useEffect: (fn: () => void) => fn(),
    useState: (init: unknown) => {
      if (init === false) return [true, jest.fn()]; // mounted = true
      return real.useState(init);
    },
  };
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockTheme = "light";
    mockResolved = "light";
  });

  describe("icon variant", () => {
    it("renders a button with accessible label when light", () => {
      render(<ThemeToggle variant="icon" />);
      expect(
        screen.getByRole("button", { name: /switch to dark theme/i })
      ).toBeInTheDocument();
    });

    it("renders dark label when resolved theme is dark", () => {
      mockResolved = "dark";
      render(<ThemeToggle variant="icon" />);
      expect(
        screen.getByRole("button", { name: /switch to light theme/i })
      ).toBeInTheDocument();
    });

    it("calls setTheme with dark when clicked in light mode", () => {
      render(<ThemeToggle variant="icon" />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });

  describe("segmented variant", () => {
    it("renders Light, System, Dark buttons", () => {
      render(<ThemeToggle variant="segmented" />);
      expect(screen.getByRole("button", { name: /switch to light theme/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /switch to system theme/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /switch to dark theme/i })).toBeInTheDocument();
    });

    it("calls setTheme with correct value on each option", () => {
      render(<ThemeToggle variant="segmented" />);
      fireEvent.click(screen.getByRole("button", { name: /switch to dark theme/i }));
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("marks the active option with aria-pressed=true", () => {
      mockTheme = "system";
      render(<ThemeToggle variant="segmented" />);
      const systemBtn = screen.getByRole("button", { name: /switch to system theme/i });
      expect(systemBtn).toHaveAttribute("aria-pressed", "true");
    });
  });
});
