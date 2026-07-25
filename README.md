# htmx-magnify

htmx extension for image magnification with zoom glass effect. Zero dependencies, no build step required.

## Installation

### Via npm

```bash
npm install htmx-magnify
```

```js
import "htmx-magnify";
import "htmx-magnify/src/htmx-magnify.css";
```

### Via CDN

```html
<link rel="stylesheet" href="https://unpkg.com/htmx-magnify/src/htmx-magnify.css">
<script src="https://unpkg.com/htmx-magnify/dist/htmx-magnify.min.js"></script>
```

### Direct download

Download `src/htmx-magnify.js` and `src/htmx-magnify.css` into your project.

## Usage

Add the `hx-magnify` attribute to any element containing an image:

```html
<div hx-magnify hx-magnify-src="/path/to/image.jpg">
  <img src="/path/to/image.jpg" alt="Product photo">
</div>
```

The extension automatically:
- Creates a magnifier glass element
- Tracks mouse/touch position
- Applies zoom effect on hover/focus
- Supports keyboard navigation

## Configuration

All configuration is done via HTML attributes:

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

### Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `hx-magnify` | flag | - | Enables the magnifier on this element |
| `hx-magnify-src` | string | **(required)** | URL of the image to magnify |
| `hx-magnify-alt` | string | `"magnifier-image"` | Alt text for the image |
| `hx-magnify-img-width` | string | `"auto"` | CSS width for the image |
| `hx-magnify-img-height` | string | `"auto"` | CSS height for the image |
| `hx-magnify-width` | number | `100` | Width of the magnifier glass (px) |
| `hx-magnify-height` | number | `100` | Height of the magnifier glass (px) |
| `hx-magnify-zoom` | number | `2` | Zoom level (1-5) |
| `hx-magnify-radius` | number | `50` | Border radius percentage (0-100) |
| `hx-magnify-border-width` | number | `3` | Border width (px) |
| `hx-magnify-border-color` | string | `"#000"` | Border color |
| `hx-magnify-border-style` | string | `"solid"` | Border style |
| `hx-magnify-shadow` | boolean | `true` | Show box shadow |
| `hx-magnify-cursor` | string | `"none"` | CSS cursor style |

## Features

### Touch Support

Works on mobile devices with touch events. The magnifier follows finger position and prevents scrolling during interaction.

### Keyboard Navigation

When the magnifier is visible:
- **Arrow keys** - Move the magnifier glass
- **Escape** - Close the magnifier

### Accessibility

- Container has `role="group"` and `aria-label`
- Screen reader announcements for magnifier state
- Focus-visible outline for keyboard users
- `tabindex="0"` on container for focus management

### Custom Events

The extension dispatches custom events on the container element:

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

### htmx Integration

Works seamlessly with htmx content swaps. The extension automatically re-initializes when new content is loaded:

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

## API

### `initMagnifier(container)`

Manually initialize a magnifier on a container element:

```js
import { initMagnifier } from "htmx-magnify";

const container = document.querySelector("#my-magnifier");
initMagnifier(container);
```

### `DEFAULTS`

Access the default configuration values:

```js
import { DEFAULTS } from "htmx-magnify";

console.log(DEFAULTS.width);  // 100
console.log(DEFAULTS.zoom);   // 2
```

## Development

```bash
# Install dependencies
npm install

# Run dev server with demo
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## License

MIT
