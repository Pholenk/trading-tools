import { render, act } from "@testing-library/react";
import { RotationGraph, RRGDatum } from "@/organisms";

// ── Fixtures ────────────────────────────────────────────────────────────────

const trail = [
  { rs: 99.5, rm: 99.5 },
  { rs: 100.0, rm: 100.0 },
];

const SINGLE: RRGDatum[] = [
  { symbol: "ABCD", rs: 101, rm: 102, trail },
];

const COMPOSITE: RRGDatum[] = [
  { symbol: "COMPOSITE", rs: 100, rm: 100, trail },
];

const MULTI: RRGDatum[] = [
  { symbol: "ABCD", rs: 101.5, rm: 102.0, trail },
  { symbol: "EFGH", rs: 98.5, rm: 97.0, trail },
  { symbol: "COMPOSITE", rs: 100.0, rm: 100.0, trail },
  { symbol: "IJKL", rs: 103.0, rm: 101.0, trail },
  // 5th item — should be sliced off (usedData = data.slice(0, 4))
  { symbol: "MNOP", rs: 99.0, rm: 98.0, trail },
];

// ── DOM / browser API stubs ─────────────────────────────────────────────────

// ResizeObserver is not implemented in jsdom
class MockResizeObserver {
  private cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) { this.cb = cb; }
  observe() {
    // Fire immediately with a 600×600 content rect so the draw effect runs
    this.cb(
      [{ contentRect: { width: 600, height: 600 } } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
  disconnect() {}
}
global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// getComputedStyle returns empty strings in jsdom — stub the CSS var
const realGetComputedStyle = window.getComputedStyle;
beforeAll(() => {
  jest.spyOn(window, "getComputedStyle").mockImplementation((el) => {
    const style = realGetComputedStyle(el);
    return new Proxy(style, {
      get(target, prop) {
        if (prop === "getPropertyValue") {
          return (name: string) =>
            name === "--on-surface-variant" ? "#40484f" : "";
        }
        return (target as unknown as Record<string | symbol, unknown>)[prop];
      },
    });
  });
});
afterAll(() => jest.restoreAllMocks());

// ── Helpers ─────────────────────────────────────────────────────────────────

function renderGraph(data: RRGDatum[]) {
  let result: ReturnType<typeof render>;
  act(() => { result = render(<RotationGraph data={data} />); });
  return result!;
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe("RotationGraph", () => {

  // ── Wrapper & SVG structure ───────────────────────────────────────────────

  it("renders a wrapping div with an svg inside", () => {
    const { container } = renderGraph(SINGLE);
    expect(container.querySelector("div > svg")).toBeInTheDocument();
  });

  it("wrapper div has width:100% and minHeight:300px inline styles", () => {
    const { container } = renderGraph(SINGLE);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.width).toBe("100%");
    expect(div.style.minHeight).toBe("300px");
  });

  it("svg has width and height attributes set after resize", () => {
    const { container } = renderGraph(SINGLE);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width");
    expect(svg).toHaveAttribute("height");
  });

  it("svg width equals svg height (keeps square aspect ratio)", () => {
    const { container } = renderGraph(SINGLE);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe(svg.getAttribute("height"));
  });

  // ── Empty data ────────────────────────────────────────────────────────────

  it("renders an empty svg when data is empty", () => {
    const { container } = renderGraph([]);
    const svg = container.querySelector("svg")!;
    // draw effect bails early — svg should have no children
    expect(svg.children.length).toBe(0);
  });

  // ── Axes ──────────────────────────────────────────────────────────────────

  it("renders two <g> axis groups", () => {
    const { container } = renderGraph(SINGLE);
    const groups = container.querySelectorAll("svg > g");
    expect(groups.length).toBeGreaterThanOrEqual(2);
  });

  it("renders two center lines", () => {
    const { container } = renderGraph(SINGLE);
    const lines = container.querySelectorAll("svg > line");
    expect(lines).toHaveLength(2);
  });

  it("center lines have stroke #666", () => {
    const { container } = renderGraph(SINGLE);
    const lines = container.querySelectorAll("svg > line");
    lines.forEach((line) =>
      expect(line).toHaveAttribute("stroke", "#666")
    );
  });

  // ── Head circles ──────────────────────────────────────────────────────────

  it("renders a head circle for each datum (up to 4)", () => {
    const { container } = renderGraph(MULTI);
    // Head circles are direct children of <svg>, not inside trail groups
    const headCircles = container.querySelectorAll("svg > circle");
    // MULTI has 5 items but usedData = data.slice(0,4)
    expect(headCircles).toHaveLength(4);
  });

  it("head circle has a larger radius than trail circles", () => {
    const { container } = renderGraph(SINGLE);
    const headCircle = container.querySelector("svg > circle")!;
    const trailCircles = container.querySelectorAll("svg > g circle");
    const headR = Number(headCircle.getAttribute("r"));
    const trailR = Number(trailCircles[0]?.getAttribute("r") ?? 0);
    expect(headR).toBeGreaterThan(trailR);
  });

  it("head circles have stroke #111", () => {
    const { container } = renderGraph(SINGLE);
    const circles = container.querySelectorAll("svg > circle");
    circles.forEach((c) => expect(c).toHaveAttribute("stroke", "#111"));
  });

  // ── Labels ────────────────────────────────────────────────────────────────

  it("renders a text label for each datum when width > 400", () => {
    // MockResizeObserver fires with width=600, so labels should appear
    const { container } = renderGraph(MULTI);
    const labels = container.querySelectorAll("text.label");
    expect(labels).toHaveLength(4); // sliced to 4
  });

  it("label text matches the symbol name", () => {
    const { container } = renderGraph(SINGLE);
    const label = container.querySelector("text.label")!;
    expect(label.textContent).toBe("ABCD");
  });

  it("labels have font-size 10px", () => {
    const { container } = renderGraph(SINGLE);
    const label = container.querySelector("text.label")!;
    expect(label).toHaveStyle("font-size: 10px");
  });

  // ── Trail groups ─────────────────────────────────────────────────────────

  it("renders a trail <g> group per symbol that has a trail", () => {
    const { container } = renderGraph(MULTI);
    // All 4 usedData items have trails with length >= 2
    const trailGroups = container.querySelectorAll("svg > g[class^='trail-']");
    expect(trailGroups).toHaveLength(4);
  });

  it("trail group class includes the symbol name", () => {
    const { container } = renderGraph(SINGLE);
    const group = container.querySelector("svg > g[class^='trail-']")!;
    expect(group.getAttribute("class")).toBe("trail-ABCD");
  });

  it("each trail group contains a <path> for the line", () => {
    const { container } = renderGraph(SINGLE);
    const group = container.querySelector("svg > g[class^='trail-']")!;
    expect(group.querySelector("path")).toBeInTheDocument();
  });

  it("trail path has no fill", () => {
    const { container } = renderGraph(SINGLE);
    const path = container.querySelector("svg > g[class^='trail-'] path")!;
    expect(path).toHaveAttribute("fill", "none");
  });

  it("trail path has stroke-width 1.5", () => {
    const { container } = renderGraph(SINGLE);
    const path = container.querySelector("svg > g[class^='trail-'] path")!;
    expect(path).toHaveAttribute("stroke-width", "1.5");
  });

  it("trail path has opacity 0.7", () => {
    const { container } = renderGraph(SINGLE);
    const path = container.querySelector("svg > g[class^='trail-'] path")!;
    expect(path).toHaveAttribute("opacity", "0.7");
  });

  it("trail group contains circle dots for each trail point + head", () => {
    const { container } = renderGraph(SINGLE);
    const group = container.querySelector("svg > g[class^='trail-']")!;
    // trail has 2 points + 1 head appended = 3 circles
    const dots = group.querySelectorAll("circle");
    expect(dots).toHaveLength(trail.length + 1);
  });

  it("skips trail rendering when trail has fewer than 2 points", () => {
    const shortTrail: RRGDatum[] = [
      { symbol: "ABCD", rs: 101, rm: 102, trail: [{ rs: 100, rm: 100 }] },
    ];
    const { container } = renderGraph(shortTrail);
    expect(container.querySelectorAll("svg > g[class^='trail-']")).toHaveLength(0);
  });

  it("skips trail rendering when trail is absent", () => {
    const noTrail: RRGDatum[] = [{ symbol: "ABCD", rs: 101, rm: 102 }];
    const { container } = renderGraph(noTrail);
    expect(container.querySelectorAll("svg > g[class^='trail-']")).toHaveLength(0);
  });

  // ── COMPOSITE colour ──────────────────────────────────────────────────────

  it("assigns the CSS var colour to the COMPOSITE symbol", () => {
    const { container } = renderGraph(COMPOSITE);
    // The head circle fill should be the stubbed CSS var value
    const headCircle = container.querySelector("svg > circle")!;
    expect(headCircle.getAttribute("fill")).toBe("#40484f");
  });

  it("assigns a hex colour (not the CSS var) to non-COMPOSITE symbols", () => {
    const { container } = renderGraph(SINGLE);
    const headCircle = container.querySelector("svg > circle")!;
    const fill = headCircle.getAttribute("fill") ?? "";
    expect(fill).toMatch(/^#[0-9a-f]{6}$/i);
    expect(fill).not.toBe("#40484f");
  });

  // ── Head/trail colour consistency ─────────────────────────────────────────

  it("head circle and trail path share the same fill/stroke colour", () => {
    const { container } = renderGraph(SINGLE);
    const headFill  = container.querySelector("svg > circle")!.getAttribute("fill");
    const trailStroke = container.querySelector("svg > g[class^='trail-'] path")!.getAttribute("stroke");
    expect(headFill).toBe(trailStroke);
  });

});
