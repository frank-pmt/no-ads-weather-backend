/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "ts",
    "json",
    "node"
  ],
  testEnvironment: "jsdom",
  testMatch: [
    '**/__tests__/**.test.ts',
  ],
  
  transform: {
    "^.+\\.(t|j)s?$": "ts-jest",
  }
};
