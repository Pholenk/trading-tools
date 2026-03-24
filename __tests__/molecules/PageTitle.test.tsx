import { render, screen } from "@testing-library/react";
import { PageTitle } from "@/components/molecules/PageTitle";

describe("PageTitle", () => {
  it("renders the title text", () => {
    render(<PageTitle title="Sector Rotation" />);
    expect(screen.getByText("Sector Rotation")).toBeInTheDocument();
  });

  it("renders title as an h1 heading", () => {
    render(<PageTitle title="Sector Rotation" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Sector Rotation" })
    ).toBeInTheDocument();
  });

  it("applies headline-large typography class to the title", () => {
    render(<PageTitle title="Sector Rotation" />);
    expect(screen.getByRole("heading")).toHaveClass("headline-large");
  });

  it("applies on-surface colour class to the title", () => {
    render(<PageTitle title="Sector Rotation" />);
    expect(screen.getByRole("heading")).toHaveClass("text-surface-foreground");
  });

  it("renders a Divider below the title", () => {
    const { container } = render(<PageTitle title="Sector Rotation" />);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });

  it("applies on-surface-variant colour class to the Divider", () => {
    const { container } = render(<PageTitle title="Sector Rotation" />);
    expect(container.querySelector("hr")).toHaveClass(
      "bg-surface-variant-foreground"
    );
  });

  it("Divider is full width", () => {
    const { container } = render(<PageTitle title="Sector Rotation" />);
    expect(container.querySelector("hr")).toHaveClass("w-full");
  });

  it("Divider is rendered after the title (correct order)", () => {
    const { container } = render(<PageTitle title="Sector Rotation" />);
    const wrapper = container.firstElementChild;
    const children = Array.from(wrapper?.children ?? []);
    expect(children[0].tagName.toLowerCase()).not.toBe("hr");
    expect(children[children.length - 1].tagName.toLowerCase()).toBe("hr");
  });

  it("applies column flex layout", () => {
    const { container } = render(<PageTitle title="Sector Rotation" />);
    expect(container.firstChild).toHaveClass("flex-col");
  });

  it("applies items-center and justify-center", () => {
    const { container } = render(<PageTitle title="Sector Rotation" />);
    expect(container.firstChild).toHaveClass("items-center", "justify-center");
  });

  it("applies padding py-5 and px-5", () => {
    const { container } = render(<PageTitle title="Sector Rotation" />);
    expect(container.firstChild).toHaveClass("py-5", "px-5");
  });

  it("applies gap-4 between children", () => {
    const { container } = render(<PageTitle title="Sector Rotation" />);
    expect(container.firstChild).toHaveClass("gap-4");
  });

  it("merges custom className onto the wrapper", () => {
    const { container } = render(
      <PageTitle title="Sector Rotation" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
