import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // Named barrel aliases — must come before the catch-all
    "^@/atoms$":     "<rootDir>/components/atoms/index.ts",
    "^@/molecules$": "<rootDir>/components/molecules/index.ts",
    "^@/organisms$": "<rootDir>/components/organisms/index.ts",
    "^@/templates$": "<rootDir>/components/templates/index.ts",
    // Sub-path aliases for atoms/molecules/organisms/templates
    "^@/(atoms|molecules|organisms|templates)/(.*)$": "<rootDir>/components/$1/$2",
    // Everything else — lib, raw-data, store, app, etc.
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "store/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/index.ts",
  ],
};

// nextJest overrides transformIgnorePatterns, so we unwrap and re-apply ours.
// d3 and its sub-packages are ESM-only and must be transformed by Babel/SWC.
const d3Packages = [
  "d3", "d3-array", "d3-axis", "d3-brush", "d3-chord", "d3-color",
  "d3-contour", "d3-delaunay", "d3-dispatch", "d3-drag", "d3-dsv",
  "d3-ease", "d3-fetch", "d3-force", "d3-format", "d3-geo",
  "d3-hierarchy", "d3-interpolate", "d3-path", "d3-polygon",
  "d3-quadtree", "d3-random", "d3-scale", "d3-scale-chromatic",
  "d3-selection", "d3-shape", "d3-time", "d3-time-format", "d3-timer",
  "d3-transition", "d3-zoom", "internmap", "robust-predicates", "delaunator",
].join("|");

// eslint-disable-next-line import/no-anonymous-default-export
export default async () => {
  const nextConfig = await createJestConfig(config)();
  return {
    ...nextConfig,
    transformIgnorePatterns: [
      `/node_modules/(?!(${d3Packages})/)`,
    ],
  };
};
