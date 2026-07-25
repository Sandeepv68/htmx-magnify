import { vi } from "vitest";

// Mock htmx global
const htmxMock = {
  defineExtension: vi.fn(),
};

global.htmx = htmxMock;

// Mock window.pageXOffset / pageYOffset
Object.defineProperty(window, "pageXOffset", { value: 0, writable: true });
Object.defineProperty(window, "pageYOffset", { value: 0, writable: true });

// Mock naturalWidth/naturalHeight/complete (read-only in jsdom)
Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
  value: 800,
  writable: true,
  configurable: true,
});
Object.defineProperty(HTMLImageElement.prototype, "naturalHeight", {
  value: 600,
  writable: true,
  configurable: true,
});
Object.defineProperty(HTMLImageElement.prototype, "complete", {
  value: true,
  writable: true,
  configurable: true,
});

// Mock getBoundingClientRect for images
HTMLImageElement.prototype.getBoundingClientRect = function () {
  return {
    left: 0,
    top: 0,
    right: this.naturalWidth || 800,
    bottom: this.naturalHeight || 600,
    width: this.naturalWidth || 800,
    height: this.naturalHeight || 600,
    x: 0,
    y: 0,
    toJSON: function () {},
  };
};
