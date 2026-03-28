import { render, screen, fireEvent } from "@testing-library/react";
import { Breadcrumb } from "@/molecules";

const ITEMS = [
  { label: "Home", onClick: jest.fn() },
  { label: "Settings", onClick: jest.fn() },
  { label: "Profile" },
];

describe("Breadcrumb", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders a nav landmark with accessible label", () => {
    render(<Breadcrumb items={ITEMS} />);
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it("renders all item labels", () => {
    render(<Breadcrumb items={ITEMS} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("marks only the last item as active", () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    const activeItems = container.querySelectorAll('[aria-current="page"]');
    expect(activeItems).toHaveLength(1);
  });

  it("last item has aria-current='page'", () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    const active = container.querySelector('[aria-current="page"]');
    expect(active).toBeInTheDocument();
    expect(active?.textContent).toContain("Profile");
  });

  it("renders clickable items as buttons", () => {
    render(<Breadcrumb items={ITEMS} />);
    // Home and Settings have onClick; Profile does not
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("calls onClick when a clickable crumb is clicked", () => {
    render(<Breadcrumb items={ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: /home/i }));
    expect(ITEMS[0].onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an ordered list", () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    expect(container.querySelector("ol")).toBeInTheDocument();
  });

  it("applies w-full to the list", () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    expect(container.querySelector("ol")).toHaveClass("w-full");
  });

  it("applies padding classes py-2 and px-3", () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    expect(container.querySelector("ol")).toHaveClass("py-2", "px-3");
  });

  it("applies horizontal flex layout classes", () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    expect(container.querySelector("ol")).toHaveClass(
      "flex", "flex-row", "items-center", "justify-start"
    );
  });

  it("renders a single item with it active", () => {
    render(<Breadcrumb items={[{ label: "Home" }]} />);
    const { container } = render(<Breadcrumb items={[{ label: "Home" }]} />);
    expect(container.querySelector('[aria-current="page"]')).toBeInTheDocument();
  });

  it("applies custom className to the list", () => {
    const { container } = render(
      <Breadcrumb items={ITEMS} className="custom-breadcrumb" />
    );
    expect(container.querySelector("ol")).toHaveClass("custom-breadcrumb");
  });
});
