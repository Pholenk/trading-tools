import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/organisms/Footer";

describe("Footer", () => {
  it("renders brand name", () => {
    render(<Footer brand="TestApp" />);
    expect(screen.getByText(/TestApp/)).toBeInTheDocument();
  });

  it("renders the current year", () => {
    render(<Footer brand="TestApp" />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("renders the tagline when provided", () => {
    render(<Footer brand="TestApp" tagline="Built with love" />);
    expect(screen.getByText("Built with love")).toBeInTheDocument();
  });

  it("does not render tagline when not provided", () => {
    render(<Footer brand="TestApp" />);
    expect(screen.queryByText(/Built with/)).not.toBeInTheDocument();
  });

  it("renders a footer landmark element", () => {
    render(<Footer brand="TestApp" />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Footer brand="TestApp" className="custom-footer" />);
    expect(screen.getByRole("contentinfo")).toHaveClass("custom-footer");
  });
});
