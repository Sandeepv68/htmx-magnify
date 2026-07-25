import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initMagnifier, DEFAULTS } from "../src/htmx-magnify.js";

function createContainer(attrs = {}) {
  const container = document.createElement("div");
  container.setAttribute("hx-magnify", "");
  for (const [key, val] of Object.entries(attrs)) {
    container.setAttribute(key, val);
  }
  const img = document.createElement("img");
  img.src = "https://example.com/test.jpg";
  img.alt = "Test image";
  container.appendChild(img);
  document.body.appendChild(container);
  return container;
}

function cleanup(container) {
  if (container._htmxMagnifier) container._htmxMagnifier.cleanup();
  container.remove();
}

describe("htmx-magnify extension", () => {
  let container;

  afterEach(() => {
    if (container) cleanup(container);
  });

  describe("initialization", () => {
    it("creates glass element on init", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);

      const glass = container.querySelector(".htmx-magnify-glass");
      expect(glass).not.toBeNull();
      expect(glass.classList.contains("htmx-magnify-hide")).toBe(true);
    });

    it("sets glass inline styles from attributes", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
        "hx-magnify-width": "150",
        "hx-magnify-height": "120",
        "hx-magnify-zoom": "3",
        "hx-magnify-radius": "25",
        "hx-magnify-border-width": "5",
        "hx-magnify-border-color": "#ff0000",
        "hx-magnify-border-style": "dashed",
        "hx-magnify-shadow": "false",
        "hx-magnify-cursor": "crosshair",
      });
      initMagnifier(container);

      const glass = container.querySelector(".htmx-magnify-glass");
      expect(glass.style.width).toBe("150px");
      expect(glass.style.height).toBe("120px");
      expect(glass.style.borderRadius).toBe("25%");
      expect(glass.style.border).toContain("5px dashed");
      expect(glass.style.border).toContain("255, 0, 0");
      expect(glass.style.cursor).toBe("crosshair");
      expect(glass.style.boxShadow).toBe("none");
    });

    it("applies default shadow when shadow=true", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
        "hx-magnify-shadow": "true",
      });
      initMagnifier(container);

      const glass = container.querySelector(".htmx-magnify-glass");
      expect(glass.style.boxShadow).toContain("rgba(0,0,0");
    });

    it("creates sr-only element for accessibility", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);

      const sr = container.querySelector(".htmx-magnify-sr-only");
      expect(sr).not.toBeNull();
      expect(sr.getAttribute("role")).toBe("status");
      expect(sr.getAttribute("aria-live")).toBe("polite");
    });

    it("logs error when hx-magnify-src is missing", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      container = createContainer();
      initMagnifier(container);

      expect(spy).toHaveBeenCalledWith("[htmx-magnify] hx-magnify-src is required");
      expect(container._htmxMagnifier == null).toBe(true);
      spy.mockRestore();
    });

    it("does not re-initialize if already initialized", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);
      initMagnifier(container);

      const glasses = container.querySelectorAll(".htmx-magnify-glass");
      expect(glasses.length).toBe(1);
    });
  });

  describe("show/hide", () => {
    it("shows glass on mouseenter", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);

      container.dispatchEvent(new MouseEvent("mouseenter"));

      const glass = container.querySelector(".htmx-magnify-glass");
      expect(glass.classList.contains("htmx-magnify-show")).toBe(true);
      expect(glass.classList.contains("htmx-magnify-hide")).toBe(false);
    });

    it("hides glass on mouseleave", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);

      container.dispatchEvent(new MouseEvent("mouseenter"));
      container.dispatchEvent(new MouseEvent("mouseleave"));

      const glass = container.querySelector(".htmx-magnify-glass");
      expect(glass.classList.contains("htmx-magnify-hide")).toBe(true);
      expect(glass.classList.contains("htmx-magnify-show")).toBe(false);
    });

    it("shows glass on focusin", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);

      container.dispatchEvent(new FocusEvent("focusin"));

      const glass = container.querySelector(".htmx-magnify-glass");
      expect(glass.classList.contains("htmx-magnify-show")).toBe(true);
    });

    it("hides glass on focusout", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);

      container.dispatchEvent(new FocusEvent("focusin"));
      container.dispatchEvent(new FocusEvent("focusout"));

      const glass = container.querySelector(".htmx-magnify-glass");
      expect(glass.classList.contains("htmx-magnify-hide")).toBe(true);
    });
  });

  describe("events", () => {
    it("dispatches magnifier-initialized on init", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      const handler = vi.fn();
      container.addEventListener("magnifier-initialized", handler);

      initMagnifier(container);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("dispatches magnifier-visible on mouseenter", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);
      const handler = vi.fn();
      container.addEventListener("magnifier-visible", handler);

      container.dispatchEvent(new MouseEvent("mouseenter"));

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("dispatches magnifier-invisible on mouseleave", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);
      container.dispatchEvent(new MouseEvent("mouseenter"));
      const handler = vi.fn();
      container.addEventListener("magnifier-invisible", handler);

      container.dispatchEvent(new MouseEvent("mouseleave"));

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("dispatches magnifier-moved on mousemove", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);
      container.dispatchEvent(new MouseEvent("mouseenter"));
      const handler = vi.fn();
      container.addEventListener("magnifier-moved", handler);

      const img = container.querySelector("img");
      img.dispatchEvent(
        new MouseEvent("mousemove", { pageX: 100, pageY: 100 })
      );

      expect(handler).toHaveBeenCalled();
    });
  });

  describe("keyboard navigation", () => {
    it("moves glass up on ArrowUp", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);
      container.dispatchEvent(new MouseEvent("mouseenter"));

      const glass = container.querySelector(".htmx-magnify-glass");
      glass.style.top = "50px";

      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));

      expect(glass.style.top).toBe("40px");
    });

    it("moves glass down on ArrowDown", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);
      container.dispatchEvent(new MouseEvent("mouseenter"));

      const glass = container.querySelector(".htmx-magnify-glass");
      glass.style.top = "50px";

      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

      expect(glass.style.top).toBe("60px");
    });

    it("moves glass left on ArrowLeft", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);
      container.dispatchEvent(new MouseEvent("mouseenter"));

      const glass = container.querySelector(".htmx-magnify-glass");
      glass.style.left = "50px";

      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft" })
      );

      expect(glass.style.left).toBe("40px");
    });

    it("moves glass right on ArrowRight", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);
      container.dispatchEvent(new MouseEvent("mouseenter"));

      const glass = container.querySelector(".htmx-magnify-glass");
      glass.style.left = "50px";

      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight" })
      );

      expect(glass.style.left).toBe("60px");
    });

    it("hides glass on Escape", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);
      container.dispatchEvent(new MouseEvent("mouseenter"));

      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

      const glass = container.querySelector(".htmx-magnify-glass");
      expect(glass.classList.contains("htmx-magnify-hide")).toBe(true);
    });

    it("clamps ArrowUp to minimum 0", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);
      container.dispatchEvent(new MouseEvent("mouseenter"));

      const glass = container.querySelector(".htmx-magnify-glass");
      glass.style.top = "5px";

      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));

      expect(glass.style.top).toBe("0px");
    });

    it("does not respond to keyboard when not visible", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);

      const glass = container.querySelector(".htmx-magnify-glass");
      glass.style.top = "50px";

      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));

      expect(glass.style.top).toBe("50px");
    });
  });

  describe("cleanup", () => {
    it("removes glass and listeners on cleanup", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);

      const glass = container.querySelector(".htmx-magnify-glass");
      expect(glass).not.toBeNull();

      container._htmxMagnifier.cleanup();

      expect(container.querySelector(".htmx-magnify-glass")).toBeNull();
      expect(container._htmxMagnifier).toBeNull();
    });

    it("removes sr-only element on cleanup", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
      });
      initMagnifier(container);

      container._htmxMagnifier.cleanup();

      expect(container.querySelector(".htmx-magnify-sr-only")).toBeNull();
    });
  });

  describe("configuration defaults", () => {
    it("has correct default values", () => {
      expect(DEFAULTS.width).toBe(100);
      expect(DEFAULTS.height).toBe(100);
      expect(DEFAULTS.zoom).toBe(2);
      expect(DEFAULTS.radius).toBe(50);
      expect(DEFAULTS.borderStyle).toBe("solid");
      expect(DEFAULTS.borderColor).toBe("#000");
      expect(DEFAULTS.borderWidth).toBe(3);
      expect(DEFAULTS.shadow).toBe(true);
      expect(DEFAULTS.cursor).toBe("none");
    });
  });

  describe("image attributes", () => {
    it("applies custom image width/height", () => {
      container = createContainer({
        "hx-magnify-src": "https://example.com/test.jpg",
        "hx-magnify-img-width": "400px",
        "hx-magnify-img-height": "300px",
      });
      initMagnifier(container);

      const img = container.querySelector("img");
      expect(img.style.width).toBe("400px");
      expect(img.style.height).toBe("300px");
    });

    it("creates img element if none exists", () => {
      container = document.createElement("div");
      container.setAttribute("hx-magnify", "");
      container.setAttribute("hx-magnify-src", "https://example.com/test.jpg");
      container.setAttribute("hx-magnify-alt", "Custom alt");
      document.body.appendChild(container);

      initMagnifier(container);

      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(img.src).toBe("https://example.com/test.jpg");
      expect(img.alt).toBe("Custom alt");

      container.remove();
    });
  });
});
