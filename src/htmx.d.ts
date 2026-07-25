declare namespace htmx {
  interface HtmxExtension {
    init(): Record<string, unknown>;
    onEvent(name: string, event: Event): void;
  }

  function defineExtension(name: string, extension: HtmxExtension): void;
}

interface HTMLElement {
  _htmxMagnifier: import("./htmx-magnify").MagnifierHandle | null;
}
