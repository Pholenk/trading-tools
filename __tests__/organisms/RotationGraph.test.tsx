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
  { symbol: "ABCD",      rs: 101.5, rm: 102.0, trail },
  { symbol: "EFGH",      rs: 98.5,  rm: 97.0,  trail },
  { symbol: "COMPOSITE", rs: 100.0, rm: 100.0, trail },
  { symbol: "IJKL",      rs: 103.0, rm: 101.0, trail },
  // 5th item — should be sliced off (usedData = data.slice(0, 4))
  { symbol: "MNOP",      rs: 99.0,  rm: 98.0,  trail },
];

// ── DOM / browser API stubs ─────────────────────────────────────────────────

class MockResizeObserver {
  private cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) { this.cb = cb; }
  observe() {
    this.cb(
      [{ contentRect: { width: 600, height: 600 } } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
  disconnect() {}
}
global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

const realGetComputedStyle = window.getComputedStyle;

const lightMock = (el: Element) => {
  const style = realGetComputedStyle(el);
  return new Proxy(style, {
    get(target, prop) {
      if (prop === "getPropertyValue") {
        return (name: string) => {
          if (name === "--on-surface-variant") return "#40484f";
          if (name === "--on-surface") return "#181c1f";
          return "";
        };
      }
      return (target as unknown as Record<string | symbol, unknown>)[prop];
    },
  });
};

beforeAll(() => {
  jest.spyOn(window, "getComputedStyle").mockImplementation(lightMock);
});
afterAll(() => jest.restoreAllMocks());
afterEach(() => {
  document.documentElement.classList.remove("dark");
  jest.spyOn(window, "getComputedStyle").mockImplementation(lightMock);
});

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

  it("wrapper div has class w-full h-full px-5", () => {
    const { container } = renderGraph(SINGLE);
    const div = container.firstElementChild as HTMLElement;
    expect(div).toHaveClass("w-full", "h-full", "px-5");
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
    lines.forEach((line) => expect(line).toHaveAttribute("stroke", "#666"));
  });

  // ── Head circles ──────────────────────────────────────────────────────────

  it("renders a head circle for each datum (up to 4)", () => {
    const { container } = renderGraph(MULTI);
    const headCircles = container.querySelectorAll("svg > circle.head");
    expect(headCircles).toHaveLength(5);
  });

  it("head circle has a larger radius than trail circles", () => {
    const { container } = renderGraph(SINGLE);
    const headCircle = container.querySelector("svg > circle.head")!;
    const trailCircles = container.querySelectorAll("svg > g circle");
    const headR = Number(headCircle.getAttribute("r"));
    const trailR = Number(trailCircles[0]?.getAttribute("r") ?? 0);
    expect(headR).toBeGreaterThan(trailR);
  });

  it("head circles have attribute 'stroke'", () => {
    const { container } = renderGraph(SINGLE);
    const circles = container.querySelectorAll("svg > circle.head");
    circles.forEach((c) => expect(c).toHaveAttribute("stroke"));
  });

  it("head circles have cursor pointer style", () => {
    const { container } = renderGraph(SINGLE);
    const head = container.querySelector<SVGCircleElement>("svg > circle.head")!;
    expect(head.style.cursor).toBe("pointer");
  });

  // ── Labels ────────────────────────────────────────────────────────────────

  it("renders a text label for each datum when width > 400", () => {
    const { container } = renderGraph(MULTI);
    const labels = container.querySelectorAll("text.label");
    expect(labels).toHaveLength(5);
  });

  it("label text matches the symbol name", () => {
    const { container } = renderGraph(SINGLE);
    const label = container.querySelector("text.label")!;
    expect(label.textContent).toBe("ABCD");
  });

  it("labels carry the label-medium class", () => {
    const { container } = renderGraph(SINGLE);
    const label = container.querySelector("text.label")!;
    expect(label).toHaveClass("label-medium");
  });

  it("label fill is set from the --on-surface CSS variable", () => {
    const { container } = renderGraph(SINGLE);
    const label = container.querySelector("text.label")!;
    expect(label).toHaveAttribute("fill", "#181c1f");
  });

  // ── Theme-adaptive labels ─────────────────────────────────────────────────

  it("re-reads --on-surface and redraws labels when the theme class changes", async () => {
    const { container } = renderGraph(SINGLE);

    await act(async () => {
      jest.spyOn(window, "getComputedStyle").mockImplementation((el) => {
        const style = realGetComputedStyle(el);
        return new Proxy(style, {
          get(target, prop) {
            if (prop === "getPropertyValue") {
              return (name: string) => {
                if (name === "--on-surface-variant") return "#c0c7d0";
                if (name === "--on-surface") return "#e0e2e7";
                return "";
              };
            }
            return (target as unknown as Record<string | symbol, unknown>)[prop];
          },
        });
      });
      document.documentElement.classList.add("dark");
      await Promise.resolve();
    });

    const label = container.querySelector("text.label")!;
    expect(label).toHaveAttribute("fill", "#e0e2e7");
  });

  // ── Trail groups ─────────────────────────────────────────────────────────

  it("renders a trail <g> group per symbol that has a trail", () => {
    const { container } = renderGraph(MULTI);
    const trailGroups = container.querySelectorAll("svg > g[class^='trail-']");
    expect(trailGroups).toHaveLength(5);
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
    const headCircle = container.querySelector("svg > circle.head")!;
    expect(headCircle.getAttribute("fill")).toBe("#40484f");
  });

  it("assigns a hex colour (not the CSS var) to non-COMPOSITE symbols", () => {
    const { container } = renderGraph(SINGLE);
    const headCircle = container.querySelector("svg > circle.head")!;
    const fill = headCircle.getAttribute("fill") ?? "";
    expect(fill).toMatch(/^#[0-9a-f]{6}$/i);
    expect(fill).not.toBe("#40484f");
  });

  // ── Head/trail colour consistency ─────────────────────────────────────────

  it("head circle and trail path share the same fill/stroke colour", () => {
    const { container } = renderGraph(SINGLE);
    const headFill    = container.querySelector("svg > circle.head")!.getAttribute("fill");
    const trailStroke = container.querySelector("svg > g[class^='trail-'] path")!.getAttribute("stroke");
    expect(headFill).toBe(trailStroke);
  });

  // ── Quadrant labels ───────────────────────────────────────────────────────

  it("renders exactly 4 quadrant labels", () => {
    const { container } = renderGraph(SINGLE);
    expect(container.querySelectorAll("text.quadrant-label")).toHaveLength(4);
  });

  it("renders all four quadrant names", () => {
    const { container } = renderGraph(SINGLE);
    const texts = Array.from(
      container.querySelectorAll("text.quadrant-label")
    ).map((el) => el.textContent);
    expect(texts).toContain("Improving");
    expect(texts).toContain("Leading");
    expect(texts).toContain("Weakening");
    expect(texts).toContain("Lagging");
  });

  it("Improving label has fill #0398fc", () => {
    const { container } = renderGraph(SINGLE);
    expect(container.querySelector("text.quadrant-improving")).toHaveAttribute("fill", "#0398fc");
  });

  it("Leading label has fill #03fc49", () => {
    const { container } = renderGraph(SINGLE);
    expect(container.querySelector("text.quadrant-leading")).toHaveAttribute("fill", "#03fc49");
  });

  it("Weakening label has fill #d49102", () => {
    const { container } = renderGraph(SINGLE);
    expect(container.querySelector("text.quadrant-weakening")).toHaveAttribute("fill", "#d49102");
  });

  it("Lagging label has fill #9c02d4", () => {
    const { container } = renderGraph(SINGLE);
    expect(container.querySelector("text.quadrant-lagging")).toHaveAttribute("fill", "#9c02d4");
  });

  it("all quadrant labels carry the label-large class", () => {
    const { container } = renderGraph(SINGLE);
    container.querySelectorAll("text.quadrant-label").forEach((el) => {
      expect(el).toHaveClass("label-large");
    });
  });

  it("top labels (Improving, Leading) use dominant-baseline hanging", () => {
    const { container } = renderGraph(SINGLE);
    (["quadrant-improving", "quadrant-leading"] as const).forEach((cls) => {
      expect(container.querySelector(`text.${cls}`)).toHaveAttribute("dominant-baseline", "hanging");
    });
  });

  it("bottom labels (Weakening, Lagging) use dominant-baseline alphabetic", () => {
    const { container } = renderGraph(SINGLE);
    (["quadrant-weakening", "quadrant-lagging"] as const).forEach((cls) => {
      expect(container.querySelector(`text.${cls}`)).toHaveAttribute("dominant-baseline", "alphabetic");
    });
  });

  it("left labels (Improving, Lagging) use text-anchor start", () => {
    const { container } = renderGraph(SINGLE);
    (["quadrant-improving", "quadrant-lagging"] as const).forEach((cls) => {
      expect(container.querySelector(`text.${cls}`)).toHaveAttribute("text-anchor", "start");
    });
  });

  it("right labels (Leading, Weakening) use text-anchor end", () => {
    const { container } = renderGraph(SINGLE);
    (["quadrant-leading", "quadrant-weakening"] as const).forEach((cls) => {
      expect(container.querySelector(`text.${cls}`)).toHaveAttribute("text-anchor", "end");
    });
  });

  it("top labels are positioned with 16px top padding from canvas edge", () => {
    const { container } = renderGraph(SINGLE);
    expect(Number(container.querySelector("text.quadrant-improving")!.getAttribute("y"))).toBe(16);
    expect(Number(container.querySelector("text.quadrant-leading")!.getAttribute("y"))).toBe(16);
  });

  it("bottom labels are positioned with 16px bottom padding from canvas edge", () => {
    const { container } = renderGraph(SINGLE);
    expect(Number(container.querySelector("text.quadrant-weakening")!.getAttribute("y"))).toBe(600 - 16);
    expect(Number(container.querySelector("text.quadrant-lagging")!.getAttribute("y"))).toBe(600 - 16);
  });

  it("left labels are positioned with 16px left padding from canvas edge", () => {
    const { container } = renderGraph(SINGLE);
    expect(Number(container.querySelector("text.quadrant-improving")!.getAttribute("x"))).toBe(16);
    expect(Number(container.querySelector("text.quadrant-lagging")!.getAttribute("x"))).toBe(16);
  });

  it("right labels are positioned with 16px right padding from canvas edge", () => {
    const { container } = renderGraph(SINGLE);
    expect(Number(container.querySelector("text.quadrant-leading")!.getAttribute("x"))).toBe(600 - 16);
    expect(Number(container.querySelector("text.quadrant-weakening")!.getAttribute("x"))).toBe(600 - 16);
  });

  it("quadrant labels are not rendered when data is empty", () => {
    const { container } = renderGraph([]);
    expect(container.querySelectorAll("text.quadrant-label")).toHaveLength(0);
  });

  // ── Hover interactions ────────────────────────────────────────────────────

  it("mousing over a head circle dims all other head circles", () => {
    const { container } = renderGraph(MULTI);
    const heads = container.querySelectorAll<SVGCircleElement>("svg > circle.head");
    heads[0].dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    Array.from(heads).slice(1).forEach((c) => {
      expect(c.getAttribute("opacity")).toBe("0.15");
    });
  });

  it("mousing over a head circle dims all other trail groups", () => {
    const { container } = renderGraph(MULTI);
    const heads = container.querySelectorAll<SVGCircleElement>("svg > circle.head");
    heads[0].dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    const trailGroups = container.querySelectorAll<SVGGElement>("svg > g[class^='trail-']");
    const dimmed = Array.from(trailGroups).filter(
      (g) => g.getAttribute("opacity") === "0.15"
    );
    expect(dimmed.length).toBe(trailGroups.length - 1);
  });

  it("mousing over a head circle grows its radius by 1.5x", () => {
    const { container } = renderGraph(SINGLE);
    const head = container.querySelector<SVGCircleElement>("svg > circle.head")!;
    const baseR = Number(head.getAttribute("r"));
    head.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(Number(head.getAttribute("r"))).toBeCloseTo(baseR * 1.5);
  });

  it("mouseleave resets all head circle radii and opacities", () => {
    const { container } = renderGraph(MULTI);
    const heads = container.querySelectorAll<SVGCircleElement>("svg > circle.head");
    const baseR = Number(heads[0].getAttribute("r"));
    heads[0].dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    heads[0].dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    Array.from(heads).forEach((c) => {
      expect(Number(c.getAttribute("r"))).toBe(baseR);
      expect(c.getAttribute("opacity")).not.toBe("0.15");
    });
  });

  it("mouseleave resets all trail group opacities", () => {
    const { container } = renderGraph(MULTI);
    const trailGroups = container.querySelectorAll<SVGGElement>("svg > g[class^='trail-']");
    trailGroups[0].dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    trailGroups[0].dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    Array.from(trailGroups).forEach((g) => {
      expect(g.getAttribute("opacity")).not.toBe("0.15");
    });
  });

  it("mouseleave resets the active trail path stroke-width to 1.5", () => {
    const { container } = renderGraph(SINGLE);
    const trailGroup = container.querySelector<SVGGElement>("svg > g[class^='trail-']")!;
    trailGroup.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    trailGroup.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    expect(trailGroup.querySelector("path")!.getAttribute("stroke-width")).toBe("1.5");
  });

});
