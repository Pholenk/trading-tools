import { render, screen, fireEvent } from "@testing-library/react";
import { ButtonIcon } from "@/components/molecules";

const mockSetTheme = jest.fn();
let mockResolved = "light";

jest.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolved,
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

describe("ButtonIcon", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockResolved = "light";
  });

  it("renders a button element", () => {
    render(<ButtonIcon />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows moon icon and correct aria-label in light mode", () => {
    mockResolved = "light";
    render(<ButtonIcon />);
    expect(
      screen.getByRole("button", { name: /switch to dark theme/i })
    ).toBeInTheDocument();
  });

  it("shows sun icon and correct aria-label in dark mode", () => {
    mockResolved = "dark";
    render(<ButtonIcon />);
    expect(
      screen.getByRole("button", { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });

  it("calls setTheme with 'dark' when clicked in light mode", () => {
    mockResolved = "light";
    render(<ButtonIcon />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'light' when clicked in dark mode", () => {
    mockResolved = "dark";
    render(<ButtonIcon />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("applies 48x48 dimension classes", () => {
    render(<ButtonIcon />);
    expect(screen.getByRole("button")).toHaveClass("w-12", "h-12");
  });

  it("applies tertiary-container background class", () => {
    render(<ButtonIcon />);
    expect(screen.getByRole("button")).toHaveClass("bg-tertiary-container");
  });

  it("applies on-tertiary-container icon colour class", () => {
    render(<ButtonIcon />);
    expect(screen.getByRole("button")).toHaveClass(
      "text-on-tertiary-container"
    );
  });

  it("applies border-radius class", () => {
    render(<ButtonIcon />);
    expect(screen.getByRole("button")).toHaveClass("rounded-[20px]");
  });

  it("merges custom className", () => {
    render(<ButtonIcon className="extra-class" />);
    expect(screen.getByRole("button")).toHaveClass("extra-class");
  });
});
