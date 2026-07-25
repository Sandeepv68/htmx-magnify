export interface MagnifierConfig {
  width: number;
  height: number;
  zoom: number;
  radius: number;
  borderStyle: string;
  borderColor: string;
  borderWidth: number;
  shadow: boolean;
  cursor: string;
}

export interface MagnifierHandle {
  config: MagnifierConfig;
  cleanup: () => void;
  handleShow: () => void;
  handleHide: () => void;
}

export declare const DEFAULTS: MagnifierConfig;

export declare function initMagnifier(container: HTMLElement): void;

declare global {
  interface HTMLElement {
    _htmxMagnifier: MagnifierHandle | null;
  }
}
