import "@testing-library/jest-dom/vitest";

// JSDOM does not implement scrollIntoView
if (typeof Element.prototype.scrollIntoView !== "function") {
  Element.prototype.scrollIntoView = () => {};
}
