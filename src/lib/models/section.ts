import { JSX } from "solid-js";

export interface Section {
  name: string;
  icon?: JSX.Element;
  href?: string;
  onClick?: () => void;
  activePattern?: RegExp;
}
