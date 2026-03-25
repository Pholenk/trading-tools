import { render, screen, fireEvent } from "@testing-library/react";
import { HomeTemplate } from "@/components/templates";

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

describe("HomeTemplate", () => {
  beforeEach(() => mockSetTheme.mockClear());

  // ── Greeting Label ───────────────────────────────────────────────────────

  it("renders default greeting line 1", () => {
    render(<HomeTemplate />);
    expect(screen.getByText("Welcome,")).toBeInTheDocument();
  });

  it("renders default greeting line 2", () => {
    render(<HomeTemplate />);
    expect(
      screen.getByText("What Stock Are You")
    ).toBeInTheDocument();
  });

  it("renders default greeting line 3", () => {
    render(<HomeTemplate />);
    expect(
      screen.getByText("Looking For?")
    ).toBeInTheDocument();
  });

  it("renders custom greeting lines when provided", () => {
    render(
      <HomeTemplate
       
        greetingLine1="Hello,"
        greetingLine2="Find Your Investment"
      />
    );
    expect(screen.getByText("Hello,")).toBeInTheDocument();
    expect(screen.getByText("Find Your Investment")).toBeInTheDocument();
  });

  it("renders greeting line 1 as h1", () => {
    render(<HomeTemplate />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("applies display-large class to both greeting lines", () => {
    const { container } = render(<HomeTemplate />);
    const displayLarge = container.querySelectorAll(".display-large");
    expect(displayLarge.length).toBeGreaterThanOrEqual(2);
  });

  it("applies on-surface colour to greeting text", () => {
    render(<HomeTemplate />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass(
      "text-on-surface"
    );
  });

  it("greeting label has max-w-[720px]", () => {
    const { container } = render(<HomeTemplate />);
    expect(
      container.querySelector(".max-w-\\[720px\\]")
    ).toBeInTheDocument();
  });

  it("greeting label is flex-col with items-center and justify-start", () => {
    const { container } = render(<HomeTemplate />);
    const greetingWrapper = container.querySelector(
      ".flex-col.items-center.justify-start"
    );
    expect(greetingWrapper).toBeInTheDocument();
  });

  it("greeting label has gap-2 and py-3 class", () => {
    const { container } = render(<HomeTemplate />);
    const greetingWrapper = container.querySelector(".gap-2.py-3");
    expect(greetingWrapper).toBeInTheDocument();
  });

  // ── InputText ────────────────────────────────────────────────────────────

  it("renders the search input", () => {
    render(<HomeTemplate />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders search placeholder", () => {
    render(
      <HomeTemplate searchPlaceholder="ASII, ADMR, BBCA..." />
    );
    expect(
      screen.getByPlaceholderText("ASII, ADMR, BBCA...")
    ).toBeInTheDocument();
  });

  it("calls onSearchChange when typing", () => {
    const handleSearch = jest.fn();
    render(
      <HomeTemplate onSearchChange={handleSearch} />
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "BBCA" },
    });
    expect(handleSearch).toHaveBeenCalledWith("BBCA");
  });

  it("renders controlled search value", () => {
    render(<HomeTemplate searchValue="ASII" />);
    expect(
      (screen.getByRole("textbox") as HTMLInputElement).value
    ).toBe("ASII");
  });

  // ── Template layout ───────────────────────────────────────────────────────

  it("applies flex and flex-1", () => {
    const { container } = render(<HomeTemplate />);
    expect(container.firstChild).toHaveClass("flex", "flex-1");
  });

  it("is flex-col (vertical direction)", () => {
    const { container } = render(<HomeTemplate />);
    expect(container.firstChild).toHaveClass("flex-col");
  });

  it("merges custom className", () => {
    const { container } = render(
      <HomeTemplate className="custom-landing" />
    );
    expect(container.firstChild).toHaveClass("custom-landing");
  });
});
