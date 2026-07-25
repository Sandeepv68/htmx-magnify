/**
 * htmx-magnify v1.0.0
 * htmx extension for image magnification with zoom glass effect
 *
 * @license MIT
 */

const PIXEL_PADDING = 3;

const KEYPAD_STEP = 10;

const DEFAULTS = {
  width: 100,
  height: 100,
  zoom: 2,
  radius: 50,
  borderStyle: "solid",
  borderColor: "#000",
  borderWidth: 3,
  shadow: true,
  cursor: "none",
};

function readAttr(elt, name, fallback) {
  const val = elt.getAttribute(name);
  if (val === null || val === "") return fallback;
  return val;
}

function readNum(elt, name, fallback) {
  const raw = readAttr(elt, name, null);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function readNumClamped(elt, name, fallback, min, max) {
  return clamp(readNum(elt, name, fallback), min, max);
}

function readBool(elt, name, fallback) {
  const raw = readAttr(elt, name, null);
  if (raw === null) return fallback;
  return raw === "true" || raw === "1";
}

function dispatchMagnifierEvent(elt, type) {
  elt.dispatchEvent(new CustomEvent(type, { detail: elt, bubbles: true }));
}

function getCursorPos(event, image) {
  const rect = image.getBoundingClientRect();
  let pageX, pageY;
  if (event.touches && event.touches.length > 0) {
    pageX = event.touches[0].pageX;
    pageY = event.touches[0].pageY;
  } else {
    pageX = event.pageX;
    pageY = event.pageY;
  }
  const x = pageX - rect.left - window.scrollX;
  const y = pageY - rect.top - window.scrollY;
  return { x, y };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function createGlass(container, image, config) {
  const glass = document.createElement("div");
  glass.className = "htmx-magnify-glass htmx-magnify-hide";
  glass.setAttribute("role", "img");
  glass.setAttribute("aria-label", "Image magnifier");

  glass.style.width = config.width + "px";
  glass.style.height = config.height + "px";
  glass.style.borderRadius = config.radius + "%";
  glass.style.border =
    config.borderWidth + "px " + config.borderStyle + " " + config.borderColor;
  glass.style.cursor = config.cursor;
  glass.style.boxShadow = config.shadow
    ? "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
    : "none";

  container.insertBefore(glass, image);
  return glass;
}

function positionGlass(glass, image, config, x, y) {
  const bw = config.width / 2;
  const bh = config.height / 2;
  const zoom = config.zoom;

  const clampedX = clamp(x, bw / zoom, image.naturalWidth - bw / zoom);
  const clampedY = clamp(y, bh / zoom, image.naturalHeight - bh / zoom);

  glass.style.left = clampedX - bw + "px";
  glass.style.top = clampedY - bh + "px";
  glass.style.backgroundPosition =
    -(clampedX * zoom - bw + PIXEL_PADDING) +
    "px " +
    -(clampedY * zoom - bh + PIXEL_PADDING) +
    "px";
}

function updateBackgroundPosition(glass, image, config) {
  const bw = config.width / 2;
  const bh = config.height / 2;
  const zoom = config.zoom;

  const left = parseFloat(glass.style.left) || 0;
  const top = parseFloat(glass.style.top) || 0;
  const x = left + bw;
  const y = top + bh;

  glass.style.backgroundPosition =
    -(x * zoom - bw + PIXEL_PADDING) +
    "px " +
    -(y * zoom - bh + PIXEL_PADDING) +
    "px";
}

function initMagnifier(container) {
  if (container._htmxMagnifier) return;

  const src = readAttr(container, "hx-magnify-src", null);
  if (!src) {
    console.error("[htmx-magnify] hx-magnify-src is required");
    return;
  }

  const config = {
    width: readNumClamped(container, "hx-magnify-width", DEFAULTS.width, 1, 1000),
    height: readNumClamped(container, "hx-magnify-height", DEFAULTS.height, 1, 1000),
    zoom: readNumClamped(container, "hx-magnify-zoom", DEFAULTS.zoom, 1, 10),
    radius: readNumClamped(container, "hx-magnify-radius", DEFAULTS.radius, 0, 50),
    borderStyle: readAttr(container, "hx-magnify-border-style", DEFAULTS.borderStyle),
    borderColor: readAttr(container, "hx-magnify-border-color", DEFAULTS.borderColor),
    borderWidth: readNumClamped(container, "hx-magnify-border-width", DEFAULTS.borderWidth, 0, 20),
    shadow: readBool(container, "hx-magnify-shadow", DEFAULTS.shadow),
    cursor: readAttr(container, "hx-magnify-cursor", DEFAULTS.cursor),
  };

  container.classList.add("htmx-magnify-container");
  if (!container.getAttribute("tabindex")) {
    container.setAttribute("tabindex", "0");
  }

  let image = container.querySelector("img");
  if (!image) {
    image = document.createElement("img");
    image.src = src;
    image.alt = readAttr(container, "hx-magnify-alt", "magnifier-image");
    container.appendChild(image);
  } else {
    if (!image.src) image.src = src;
    if (!image.alt) image.alt = readAttr(container, "hx-magnify-alt", "magnifier-image");
  }

  const imgWidth = readAttr(container, "hx-magnify-img-width", null);
  const imgHeight = readAttr(container, "hx-magnify-img-height", null);
  if (imgWidth) image.style.width = imgWidth;
  if (imgHeight) image.style.height = imgHeight;

  const srOnly = document.createElement("div");
  srOnly.className = "htmx-magnify-sr-only";
  srOnly.setAttribute("role", "status");
  srOnly.setAttribute("aria-live", "polite");
  srOnly.textContent =
    "Magnifier active. Use arrow keys to navigate, Escape to close.";
  container.appendChild(srOnly);

  let glass = null;
  let isVisible = false;

  function handleShow() {
    if (!glass || isVisible) return;
    glass.classList.remove("htmx-magnify-hide");
    glass.classList.add("htmx-magnify-show");
    glass.style.pointerEvents = "auto";
    isVisible = true;
    srOnly.style.display = "";
    container.focus();
    dispatchMagnifierEvent(container, "magnifier-visible");
  }

  function handleHide() {
    if (!glass || !isVisible) return;
    glass.classList.remove("htmx-magnify-show");
    glass.classList.add("htmx-magnify-hide");
    glass.style.pointerEvents = "none";
    isVisible = false;
    srOnly.style.display = "none";
    dispatchMagnifierEvent(container, "magnifier-invisible");
  }

  function handleMove(event) {
    if (!glass || !isVisible) return;
    event.preventDefault();
    const { x, y } = getCursorPos(event, image);
    positionGlass(glass, image, config, x, y);
    dispatchMagnifierEvent(container, "magnifier-moved");
  }

  function handleKeyDown(event) {
    if (!isVisible || !glass) return;

    let moved = false;
    switch (event.key) {
      case "ArrowUp": {
        const top = parseFloat(glass.style.top) || 0;
        glass.style.top = Math.max(0, top - KEYPAD_STEP) + "px";
        moved = true;
        break;
      }
      case "ArrowDown": {
        const top = parseFloat(glass.style.top) || 0;
        glass.style.top = top + KEYPAD_STEP + "px";
        moved = true;
        break;
      }
      case "ArrowLeft": {
        const left = parseFloat(glass.style.left) || 0;
        glass.style.left = Math.max(0, left - KEYPAD_STEP) + "px";
        moved = true;
        break;
      }
      case "ArrowRight": {
        const left = parseFloat(glass.style.left) || 0;
        glass.style.left = left + KEYPAD_STEP + "px";
        moved = true;
        break;
      }
      case "Escape":
        handleHide();
        return;
      default:
        return;
    }

    if (moved) {
      event.preventDefault();
      updateBackgroundPosition(glass, image, config);
      dispatchMagnifierEvent(container, "magnifier-moved");
    }
  }

  function onLoad() {
    glass = createGlass(container, image, config);
    glass.style.backgroundImage = "url('" + image.src.replace(/['\\]/g, "\\$&") + "')";
    glass.style.backgroundSize =
      image.naturalWidth * config.zoom + "px " + image.naturalHeight * config.zoom + "px";

    container.addEventListener("mouseenter", handleShow);
    container.addEventListener("mouseleave", handleHide);
    container.addEventListener("focusin", handleShow);
    container.addEventListener("focusout", handleHide);
    glass.addEventListener("touchmove", handleMove, { passive: false });
    glass.addEventListener("mousemove", handleMove);
    image.addEventListener("touchmove", handleMove, { passive: false });
    image.addEventListener("mousemove", handleMove);
    container.addEventListener("keydown", handleKeyDown);

    dispatchMagnifierEvent(container, "magnifier-initialized");
  }

  function cleanup() {
    container.removeEventListener("mouseenter", handleShow);
    container.removeEventListener("mouseleave", handleHide);
    container.removeEventListener("focusin", handleShow);
    container.removeEventListener("focusout", handleHide);
    if (glass) {
      glass.removeEventListener("touchmove", handleMove);
      glass.removeEventListener("mousemove", handleMove);
      glass.remove();
    }
    image.removeEventListener("touchmove", handleMove);
    image.removeEventListener("mousemove", handleMove);
    container.removeEventListener("keydown", handleKeyDown);
    image.removeEventListener("error", handleImageError);
    srOnly.remove();
    container._htmxMagnifier = null;
  }

  function handleImageError() {
    console.error("[htmx-magnify] Failed to load image:", image.src);
    cleanup();
  }

  if (image.complete && image.naturalWidth > 0) {
    onLoad();
  } else {
    image.addEventListener("load", onLoad, { once: true });
    image.addEventListener("error", handleImageError, { once: true });
  }

  container._htmxMagnifier = { config, cleanup, handleShow, handleHide };
}

htmx.defineExtension("magnify", {
  init: function () {
    return {};
  },

  onEvent: function (name, event) {
    if (name === "htmx:load" || name === "htmx:afterSwap") {
      const target =
        name === "htmx:load" ? event.detail.elt : event.detail.target || event.detail.elt;
      const containers = target.querySelectorAll
        ? [target, ...target.querySelectorAll("[hx-magnify]")]
        : [target];
      containers.forEach(function (elt) {
        if (elt.hasAttribute && elt.hasAttribute("hx-magnify")) {
          if (elt._htmxMagnifier) elt._htmxMagnifier.cleanup();
          initMagnifier(elt);
        }
      });
    }

    if (name === "htmx:afterRemoveNode") {
      const elt = event.detail.node;
      if (elt && elt._htmxMagnifier) {
        elt._htmxMagnifier.cleanup();
      }
    }
  },
});

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[hx-magnify]").forEach(initMagnifier);
  });
}

export { initMagnifier, DEFAULTS };
