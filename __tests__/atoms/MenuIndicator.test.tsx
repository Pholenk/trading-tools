import { render } from "@testing-library/react";
import { MenuIndicator } from "@/components/atoms/MenuIndicator";

describe("MenuIndicator", () => {
  it("renders without crashing", () => {
    const { container } = render(<MenuIndicator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("is aria-hidden", () => {
    const { container } = render(<MenuIndicator />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("applies active bg class when active=true", () => {
    const { container } = render(<MenuIndicator active />);
    expect(container.firstChild).toHaveClass("bg-surface-foreground");
  });

  it("applies transparent bg class when inactive", () => {
    const { container } = render(<MenuIndicator active={false} />);
    expect(container.firstChild).toHaveClass("bg-transparent");
  });

  it("defaults to inactive state", () => {
    const { container } = render(<MenuIndicator />);
    expect(container.firstChild).toHaveClass("bg-transparent");
  });

  it("applies fixed height and border-radius classes", () => {
    const { container } = render(<MenuIndicator />);
    expect(container.firstChild).toHaveClass("h-[3px]", "rounded-[20px]", "w-full");
  });

  it("merges custom className", () => {
    const { container } = render(<MenuIndicator className="my-custom" />);
    expect(container.firstChild).toHaveClass("my-custom");
  });
});
