import themeReducer, {
  setTheme,
  toggleTheme,
  type ThemeMode,
} from "@/store/slices/themeSlice";

describe("themeSlice", () => {
  const initialState = { mode: "system" as ThemeMode };

  it("returns the initial state", () => {
    expect(themeReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("setTheme sets the mode to light", () => {
    const state = themeReducer(initialState, setTheme("light"));
    expect(state.mode).toBe("light");
  });

  it("setTheme sets the mode to dark", () => {
    const state = themeReducer(initialState, setTheme("dark"));
    expect(state.mode).toBe("dark");
  });

  it("setTheme sets the mode to system", () => {
    const state = themeReducer({ mode: "dark" }, setTheme("system"));
    expect(state.mode).toBe("system");
  });

  it("toggleTheme switches light → dark", () => {
    const state = themeReducer({ mode: "light" }, toggleTheme());
    expect(state.mode).toBe("dark");
  });

  it("toggleTheme switches dark → light", () => {
    const state = themeReducer({ mode: "dark" }, toggleTheme());
    expect(state.mode).toBe("light");
  });

  it("toggleTheme from system → light (default fallback)", () => {
    // system is not "light" so it toggles to "light"
    const state = themeReducer({ mode: "system" }, toggleTheme());
    expect(state.mode).toBe("light");
  });
});
