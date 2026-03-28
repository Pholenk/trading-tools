import { render, screen, fireEvent } from "@testing-library/react";
import { InputText } from "@/molecules";

describe("InputText", () => {
  it("renders an input element", () => {
    render(<InputText />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders the Search icon (aria-hidden)", () => {
    const { container } = render(<InputText />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("renders placeholder text", () => {
    render(<InputText placeholder="ASII, ADMR, BBCA..." />);
    expect(
      screen.getByPlaceholderText("ASII, ADMR, BBCA...")
    ).toBeInTheDocument();
  });

  it("accepts and reflects typed input", () => {
    render(<InputText />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "BBCA" } });
    expect((input as HTMLInputElement).value).toBe("BBCA");
  });

  it("calls onChange when user types", () => {
    const handleChange = jest.fn();
    render(<InputText onChange={handleChange} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "test" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("applies container background class", () => {
    const { container } = render(<InputText />);
    expect(container.firstChild).toHaveClass("bg-surface-container-high");
  });

  it("applies rounded-[28px] to the container", () => {
    const { container } = render(<InputText />);
    expect(container.firstChild).toHaveClass("rounded-[28px]");
  });

  it("applies px-5 horizontal padding to the container", () => {
    const { container } = render(<InputText />);
    expect(container.firstChild).toHaveClass("px-5");
  });

  it("applies gap-[10px] to the container", () => {
    const { container } = render(<InputText />);
    expect(container.firstChild).toHaveClass("gap-[10px]");
  });

  it("applies w-full to the container", () => {
    const { container } = render(<InputText />);
    expect(container.firstChild).toHaveClass("w-full");
  });

  it("applies flex-row and items-center to the container", () => {
    const { container } = render(<InputText />);
    expect(container.firstChild).toHaveClass("flex-row", "items-center");
  });

  it("applies text colour class to the input", () => {
    render(<InputText />);
    expect(screen.getByRole("textbox")).toHaveClass("text-on-surface");
  });

  it("applies placeholder colour class to the input", () => {
    render(<InputText />);
    expect(screen.getByRole("textbox")).toHaveClass(
      "placeholder:text-on-surface-variant"
    );
  });

  it("applies body-large typography class to the input", () => {
    render(<InputText />);
    expect(screen.getByRole("textbox")).toHaveClass("body-large");
  });

  it("input has transparent background (molecule owns the bg)", () => {
    render(<InputText />);
    expect(screen.getByRole("textbox")).toHaveClass("bg-transparent");
  });

  it("input has no border (molecule owns the shape)", () => {
    render(<InputText />);
    expect(screen.getByRole("textbox")).toHaveClass("border-none");
  });

  it("forwards ref to the underlying input element", () => {
    const ref = { current: null };
    render(<InputText ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("merges custom className onto the input", () => {
    render(<InputText className="custom-input" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-input");
  });

  it("merges containerClassName onto the wrapper div", () => {
    const { container } = render(
      <InputText containerClassName="custom-container" />
    );
    expect(container.firstChild).toHaveClass("custom-container");
  });

  it("is disabled when disabled prop is passed", () => {
    render(<InputText disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
