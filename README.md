# htmx-magnify

<p align="center">
  <img src="assets/logo.png" alt="htmx-magnify logo" width="600">
</p>

<p align="center">
  <strong>htmx extension for image magnification with zoom glass effect</strong><br>
  Zero dependencies, no build step required.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/htmx-magnify"><img src="https://img.shields.io/npm/v/htmx-magnify.svg" alt="npm version"></a>
  <a href="https://github.com/Sandeepv68/htmx-magnify/actions"><img src="https://github.com/Sandeepv68/htmx-magnify/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/Sandeepv68/htmx-magnify/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/htmx-magnify.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/htmx-magnify"><img src="https://img.shields.io/npm/dm/htmx-magnify.svg" alt="npm downloads"></a>
</p>

---

## Highlights

- **Zero dependencies** -- lightweight, no runtime bloat
- **Drop-in htmx extension** -- works with `hx-magnify` attribute, no JS required
- **Mouse, touch, and keyboard** support out of the box
- **Fully configurable** -- glass size, zoom, border, radius, shadow, cursor style
- **Accessible** -- ARIA roles, screen reader announcements, focus-visible support
- **Auto-reinit on htmx swaps** -- re-initializes automatically when content changes
- **~4 KB** minified + gzipped

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [Attributes Reference](#attributes-reference)
  - [Shape Examples](#shape-examples)
- [Features](#features)
  - [Touch Support](#touch-support)
  - [Keyboard Navigation](#keyboard-navigation)
  - [Accessibility](#accessibility)
  - [Custom Events](#custom-events)
  - [Dynamic Reconfiguration](#dynamic-reconfiguration)
  - [htmx Integration](#htmx-integration)
  - [Programmatic Usage](#programmatic-usage)
- [API Reference](#api-reference)
- [Development](#development)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Installation

### npm

```bash
npm install htmx-magnify
```

```js
import "htmx-magnify";
import "htmx-magnify/src/htmx-magnify.css";
```

### CDN (unpkg)

```html
<link rel="stylesheet" href="https://unpkg.com/htmx-magnify@1/src/htmx-magnify.css">
<script src="https://unpkg.com/htmx-magnify@1/dist/htmx-magnify.min.js"></script>
```

### CDN (jsDelivr)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/htmx-magnify@1/src/htmx-magnify.css">
<script src="https://cdn.jsdelivr.net/npm/htmx-magnify@1/dist/htmx-magnify.min.js"></script>
```

### Direct download

Download `src/htmx-magnify.js` and `src/htmx-magnify.css` into your project and include them with a `<script>` and `<link>` tag.

> **Note:** htmx (`>=1.9.0`) is a peer dependency. Load it before htmx-magnify.

## Quick Start

Add the `hx-magnify` attribute to any element containing an image:

```html
<div hx-magnify hx-magnify-src="/path/to/image.jpg">
  <img src="/path/to/image.jpg" alt="Product photo">
</div>
```

That's it. The extension automatically:

- Creates a magnifier glass element on hover/focus
- Tracks mouse and touch position over the image
- Renders a zoomed-in view inside the glass
- Cleans up when the mouse leaves or focus is lost

## Configuration

All configuration is done via HTML attributes -- no JavaScript needed:

```html
<div hx-magnify
     hx-magnify-src="/image.jpg"
     hx-magnify-width="120"
     hx-magnify-height="120"
     hx-magnify-zoom="2.5"
     hx-magnify-radius="50"
     hx-magnify-border-width="3"
     hx-magnify-border-color="#000"
     hx-magnify-border-style="solid"
     hx-magnify-shadow="true"
     hx-magnify-cursor="none">
  <img src="/image.jpg" alt="Product">
</div>
```

### Attributes Reference

| Attribute | Type | Default | Description |
|---|---|---|---|
| `hx-magnify` | flag | -- | Enables the magnifier on this element |
| `hx-magnify-src` | string | **(required)** | URL of the high-resolution image to magnify |
| `hx-magnify-alt` | string | `"magnifier-image"` | Alt text when no `<img>` is present in the container |
| `hx-magnify-img-width` | string | -- | CSS width applied to the image (e.g. `"400px"`, `"100%"`) |
| `hx-magnify-img-height` | string | -- | CSS height applied to the image (e.g. `"300px"`, `"auto"`) |
| `hx-magnify-width` | number | `100` | Width of the magnifier glass in pixels |
| `hx-magnify-height` | number | `100` | Height of the magnifier glass in pixels |
| `hx-magnify-zoom` | number | `2` | Zoom multiplier (1 = no zoom, higher = more zoom) |
| `hx-magnify-radius` | number | `50` | Border-radius percentage (0 = rectangle, 50 = circle) |
| `hx-magnify-border-width` | number | `3` | Border width in pixels |
| `hx-magnify-border-color` | string | `"#000"` | Border color (any CSS color value) |
| `hx-magnify-border-style` | string | `"solid"` | Border style (`solid`, `dashed`, `dotted`, etc.) |
| `hx-magnify-shadow` | boolean | `true` | Show a drop shadow on the glass (`"true"` or `"false"`) |
| `hx-magnify-cursor` | string | `"none"` | CSS cursor when hovering the image (`"crosshair"`, `"zoom-in"`, `"pointer"`, etc.) |

### Shape Examples

**Circle glass:**

```html
<div hx-magnify hx-magnify-src="/image.jpg"
     hx-magnify-width="120" hx-magnify-height="120"
     hx-magnify-radius="50">
  <img src="/image.jpg" alt="Product">
</div>
```

**Rectangle glass:**

```html
<div hx-magnify hx-magnify-src="/image.jpg"
     hx-magnify-width="160" hx-magnify-height="100"
     hx-magnify-radius="10">
  <img src="/image.jpg" alt="Product">
</div>
```

**No shadow, dashed border:**

```html
<div hx-magnify hx-magnify-src="/image.jpg"
     hx-magnify-shadow="false"
     hx-magnify-border-style="dashed"
     hx-magnify-border-color="#4a90e2">
  <img src="/image.jpg" alt="Product">
</div>
```

## Features

### Touch Support

Works on mobile devices with touch events. The magnifier follows finger position and prevents scrolling during interaction.

```html
<div hx-magnify hx-magnify-src="/image.jpg">
  <img src="/image.jpg" alt="Product">
</div>
```

> **Tip:** On touch devices, the magnifier activates on touch and deactivates when the finger lifts.

### Keyboard Navigation

When the magnifier is visible, keyboard users can:

| Key | Action |
|---|---|
| **Arrow Up** | Move the glass up by 10px |
| **Arrow Down** | Move the glass down by 10px |
| **Arrow Left** | Move the glass left by 10px |
| **Arrow Right** | Move the glass right by 10px |
| **Escape** | Close the magnifier |

> **Note:** The glass position is clamped to image boundaries, so it won't move beyond the image edges.

### Accessibility

- **ARIA roles** -- glass has `role="img"` with `aria-label="Image magnifier"`
- **Screen reader live region** -- announces magnifier state changes (`aria-live="polite"`)
- **Focus management** -- container gets `htmx-magnify-container` class with `outline` on `:focus-visible`
- **Keyboard operable** -- full magnifier control without a mouse

### Custom Events

The extension dispatches custom events on the container element for integration with your application:

| Event | When | `event.detail` |
|---|---|---|
| `magnifier-initialized` | Glass element created and ready | container element |
| `magnifier-visible` | Glass shown (mouseenter / focusin) | container element |
| `magnifier-invisible` | Glass hidden (mouseleave / focusout) | container element |
| `magnifier-moved` | Glass position updated | container element |

```js
const magnifier = document.querySelector("[hx-magnify]");

magnifier.addEventListener("magnifier-initialized", (e) => {
  console.log("Magnifier ready");
});

magnifier.addEventListener("magnifier-visible", (e) => {
  console.log("Magnifier shown");
});

magnifier.addEventListener("magnifier-invisible", (e) => {
  console.log("Magnifier hidden");
});

magnifier.addEventListener("magnifier-moved", (e) => {
  console.log("Magnifier moved");
});
```

### Dynamic Reconfiguration

You can change magnifier settings at runtime by updating attributes and re-processing with htmx:

```js
const magnifier = document.querySelector("#my-magnifier");

// Clean up existing instance
magnifier._htmxMagnifier.cleanup();

// Update attributes
magnifier.setAttribute("hx-magnify-zoom", "3");
magnifier.setAttribute("hx-magnify-width", "150");

// Re-initialize
htmx.process(magnifier);
```

### htmx Integration

Works seamlessly with htmx content swaps. The extension automatically re-initializes when new content is loaded via `htmx:afterSwap` and cleans up on `htmx:afterRemoveNode`:

```html
<button hx-get="/api/product-image" hx-target="#image-container" hx-swap="innerHTML">
  Load Image
</button>

<div id="image-container">
  <div hx-magnify hx-magnify-src="/api/product-image">
    <img src="/api/product-image" alt="Product">
  </div>
</div>
```

> **Note:** No extra configuration needed. The extension hooks into htmx lifecycle events automatically.

### Programmatic Usage

If you need to initialize magnifiers outside of htmx:

```js
import { initMagnifier } from "htmx-magnify";

// Initialize a single container
const container = document.querySelector("#my-magnifier");
initMagnifier(container);

// Initialize all magnifiers on the page
document.querySelectorAll("[hx-magnify]").forEach(initMagnifier);
```

## API Reference

### `initMagnifier(container)`

Manually initialize a magnifier on a container element.

- **`container`** (`HTMLElement`) -- A DOM element with `hx-magnify` and `hx-magnify-src` attributes
- **Returns:** `undefined`
- **Side effects:** Adds `htmx-magnify-container` class, creates glass element, attaches event listeners
- **Idempotent:** Calling on an already-initialized container is a no-op

```js
import { initMagnifier } from "htmx-magnify";

const container = document.querySelector("#my-magnifier");
initMagnifier(container);
```

### `DEFAULTS`

Object containing the default configuration values:

```js
import { DEFAULTS } from "htmx-magnify";

console.log(DEFAULTS); // { width: 100, height: 100, zoom: 2, radius: 50, ... }
```

| Property | Value |
|---|---|
| `width` | `100` |
| `height` | `100` |
| `zoom` | `2` |
| `radius` | `50` |
| `borderStyle` | `"solid"` |
| `borderColor` | `"#000"` |
| `borderWidth` | `3` |
| `shadow` | `true` |
| `cursor` | `"none"` |

### `container._htmxMagnifier`

Internal handle attached to each initialized container. Contains:

| Property | Type | Description |
|---|---|---|
| `_htmxMagnifier.config` | Object | Current configuration |
| `_htmxMagnifier.cleanup()` | Function | Removes glass, event listeners, and resets the container |
| `_htmxMagnifier.handleShow()` | Function | Programmatically show the magnifier |
| `_htmxMagnifier.handleHide()` | Function | Programmatically hide the magnifier |

```js
const container = document.querySelector("[hx-magnify]");

// Show magnifier programmatically
container._htmxMagnifier.handleShow();

// Hide magnifier programmatically
container._htmxMagnifier.handleHide();

// Full cleanup (removes glass, listeners, sr-only element)
container._htmxMagnifier.cleanup();
```

## Development

```bash
# Install dependencies
npm install

# Run dev server with demo
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Build for production
npm run build
```

### Project Structure

```
htmx-magnify/
├── src/
│   ├── htmx-magnify.js      # Main extension source
│   └── htmx-magnify.css     # Styles for glass, container, sr-only
├── dist/
│   ├── htmx-magnify.js      # ESM bundle
│   └── htmx-magnify.min.js  # IIFE minified bundle
├── demo/
│   └── index.html           # Interactive demo page
├── test/
│   ├── setup.js             # Vitest + jsdom setup, mocks
│   └── htmx-magnify.test.js # Unit tests (28 tests)
├── .github/workflows/
│   ├── ci.yml               # Lint, test, build (Node 18/20/22)
│   ├── release.yml          # Manual version bump + GitHub release
│   └── publish.yml          # npm publish on release
├── package.json
├── vitest.config.js
└── .eslintrc.json
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Setting up the development environment
- Running tests and linting
- Submitting pull requests

## Security

To report security vulnerabilities, please use [GitHub's private vulnerability reporting](https://github.com/Sandeepv68/htmx-magnify/security/advisories/new). See [SECURITY.md](SECURITY.md) for details.

## License

[MIT](LICENSE)
