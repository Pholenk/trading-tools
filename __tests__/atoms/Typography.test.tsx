import { render, screen } from "@testing-library/react";
import { Typography } from "@/atoms";

describe("Typography", () => {
  it("renders children", () => {
    render(<Typography variant="body-large">Hello</Typography>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies the correct variant class", () => {
    render(<Typography variant="headline-large">Headline</Typography>);
    expect(screen.getByText("Headline")).toHaveClass("headline-large");
  });

  it("renders correct default tag for display variant", () => {
    const { container } = render(
      <Typography variant="display-large">Display</Typography>
    );
    expect(container.querySelector("h1")).toBeInTheDocument();
  });

  it("renders correct default tag for body variant", () => {
    const { container } = render(
      <Typography variant="body-medium">Body</Typography>
    );
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("renders correct default tag for label variant", () => {
    const { container } = render(
      <Typography variant="label-small">Label</Typography>
    );
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("respects the as prop override", () => {
    const { container } = render(
      <Typography variant="body-large" as="div">Content</Typography>
    );
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("applies color variant class", () => {
    render(
      <Typography variant="body-medium" textColor="primary">
        Colored
      </Typography>
    );
    expect(screen.getByText("Colored")).toHaveClass("text-primary");
  });

  it("merges custom className", () => {
    render(
      <Typography variant="body-medium" className="my-custom-class">
        Custom
      </Typography>
    );
    expect(screen.getByText("Custom")).toHaveClass("my-custom-class");
  });
});
