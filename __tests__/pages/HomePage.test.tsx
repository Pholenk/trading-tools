import { render, screen } from "@testing-library/react";
import Page from "@/app/(public)/page";

/**
 * Mock <HomeTemplate /> so this suite focuses on the Page layer only.
 * Template internals are covered by HomeTemplate.test.tsx.
 */
jest.mock("@/templates", () => ({
  HomeTemplate: ({ className }: { className?: string }) => (
    <div data-testid="home-template" className={className}>
      HomeTemplate
    </div>
  ),
}));

describe("Page (HomePage)", () => {
  it("renders without crashing", () => {
    render(<Page />);
    expect(screen.getByTestId("home-template")).toBeInTheDocument();
  });

  it("renders <HomeTemplate />", () => {
    render(<Page />);
    expect(screen.getByTestId("home-template")).toBeInTheDocument();
  });

  it("passes template-default padding classes to HomeTemplate", () => {
    render(<Page />);
    const template = screen.getByTestId("home-template");
    expect(template).toHaveClass("py-12", "pl-18", "pr-13");
  });
});
