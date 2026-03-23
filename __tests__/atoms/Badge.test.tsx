import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/atoms/Badge";

describe("Badge", () => {
  it("renders children correctly", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies default variant class", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass("bg-primary");
  });

  it("applies secondary variant class", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary")).toHaveClass("bg-secondary-container");
  });

  it("applies outline variant class", () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline")).toHaveClass("border-outline");
  });

  it("merges custom className", () => {
    render(<Badge className="extra-class">Badge</Badge>);
    expect(screen.getByText("Badge")).toHaveClass("extra-class");
  });
});
