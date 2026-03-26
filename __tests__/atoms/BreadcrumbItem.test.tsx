import { render, screen, fireEvent } from "@testing-library/react";
import { BreadcrumbItem } from "@/components/atoms/BreadcrumbItem";

describe("BreadcrumbItem", () => {
  it("renders the label text", () => {
    render(<BreadcrumbItem label="Home" />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders a ChevronRight icon (aria-hidden)", () => {
    const { container } = render(<BreadcrumbItem label="Home" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("applies inactive colour class when not active", () => {
    render(<BreadcrumbItem label="Home" />);
    const wrapper = screen.getByText("Home").closest("span");
    expect(wrapper).toHaveClass("text-on-surface-variant");
  });

  it("applies active colour class when active", () => {
    render(<BreadcrumbItem label="Home" active />);
    const wrapper = screen.getByText("Home").closest("span");
    expect(wrapper).toHaveClass("text-on-surface");
  });

  it("renders as a plain span when no onClick is provided", () => {
    const { container } = render(<BreadcrumbItem label="Home" />);
    expect(container.querySelector("button")).not.toBeInTheDocument();
  });

  it("renders as a button when onClick is provided", () => {
    render(<BreadcrumbItem label="Home" onClick={jest.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onClick when the button is clicked", () => {
    const handleClick = jest.fn();
    render(<BreadcrumbItem label="Home" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("sets aria-current='page' on active item", () => {
    const { container } = render(<BreadcrumbItem label="Home" active />);
    expect(
      container.querySelector('[aria-current="page"]')
    ).toBeInTheDocument();
  });

  it("does not set aria-current when inactive", () => {
    const { container } = render(<BreadcrumbItem label="Home" />);
    expect(
      container.querySelector('[aria-current]')
    ).not.toBeInTheDocument();
  });

  it("renders horizontal flex layout classes", () => {
    render(<BreadcrumbItem label="Home" />);
    const wrapper = screen.getByText("Home").closest("span.inline-flex");
    expect(wrapper).toHaveClass("flex-row", "items-center", "justify-start");
  });
});
