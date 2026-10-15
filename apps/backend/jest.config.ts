import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@diorama/db$": "<rootDir>/src/__mocks__/@diorama/db.ts",
  },
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "<rootDir>/tsconfig.spec.json",
      },
    ],
  },
  setupFiles: ["<rootDir>/src/__tests__/setup.ts"],
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/__tests__/**",
    "!src/__mocks__/**",
    "!src/index.ts",
  ],
};

export default config;
