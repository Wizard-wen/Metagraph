export interface ContextmenuItem {
  text?: string;
  subText?: string;
  divider?: boolean;
  disable?: boolean;
  hide?: boolean;
  children?: ContextmenuItem[];
  handler?: (element: HTMLElement) => void;
}

export interface Axis {
  x: number;
  y: number;
}
