import { render, screen, fireEvent } from "@testing-library/react";
import { MenuItem } from "@/components/molecules/MenuItem";

describe("MenuItem", () => {
  it("renders the label text", () => {
    render(<MenuItem label="Rotation" />);
    expect(screen.getByText("Rotation")).toBeInTheDocument();
  });

  it("renders as a button with role=tab", () => {
    render(<MenuItem label="Wave" />);
    expect(screen.getByRole("tab", { name: "Wave" })).toBeInTheDocument();
  });

  it("sets aria-selected=true when active", () => {
    render(<MenuItem label="Rotation" active />);
    expect(screen.getByRole("tab")).toHaveAttribute("aria-selected", "true");
  });

  it("sets aria-selected=false when inactive", () => {
    render(<MenuItem label="Wave" active={false} />);
    expect(screen.getByRole("tab")).toHaveAttribute("aria-selected", "false");
  });

  it("applies active text colour class when active", () => {
    render(<MenuItem label="Rotation" active />);
    const label = screen.getByText("Rotation");
    expect(label).toHaveClass("text-surface-foreground");
  });

  it("applies inactive text colour class when not active", () => {
    render(<MenuItem label="Wave" />);
    const label = screen.getByText("Wave");
    expect(label).toHaveClass("text-surface-variant-foreground");
  });

  it("calls onClick with the label when clicked", () => {
    const handleClick = jest.fn();
    render(<MenuItem label="Calculator" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("tab"));
    expect(handleClick).toHaveBeenCalledWith("Calculator");
  });

  it("does not throw when onClick is not provided", () => {
    render(<MenuItem label="Rotation" />);
    expect(() => fireEvent.click(screen.getByRole("tab"))).not.toThrow();
  });

  it("renders a MenuIndicator inside", () => {
    const { container } = render(<MenuItem label="Rotation" active />);
    // The indicator span is aria-hidden
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("merges custom className onto the button", () => {
    render(<MenuItem label="Rotation" className="custom-class" />);
    expect(screen.getByRole("tab")).toHaveClass("custom-class");
  });

  it("applies min-width and height classes", () => {
    render(<MenuItem label="Rotation" />);
    expect(screen.getByRole("tab")).toHaveClass("min-w-[100px]", "h-[48px]");
  });
});
