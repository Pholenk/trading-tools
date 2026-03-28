import { render } from "@testing-library/react";
import { Divider } from "@/components/atoms";

describe("Divider", () => {
  it("renders an hr element", () => {
    const { container } = render(<Divider />);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });

  it("is aria-hidden", () => {
    const { container } = render(<Divider />);
    expect(container.querySelector("hr")).toHaveAttribute("aria-hidden", "true");
  });

  it("applies w-full class", () => {
    const { container } = render(<Divider />);
    expect(container.querySelector("hr")).toHaveClass("w-full");
  });

  it("applies h-[2px] class", () => {
    const { container } = render(<Divider />);
    expect(container.querySelector("hr")).toHaveClass("h-[2px]");
  });

  it("applies bg-outline-variant colour class", () => {
    const { container } = render(<Divider />);
    expect(container.querySelector("hr")).toHaveClass("bg-outline-variant");
  });

  it("removes default border", () => {
    const { container } = render(<Divider />);
    expect(container.querySelector("hr")).toHaveClass("border-none");
  });

  it("merges custom className", () => {
    const { container } = render(<Divider className="my-4" />);
    expect(container.querySelector("hr")).toHaveClass("my-4");
  });
});
