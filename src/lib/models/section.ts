export interface Section {
  name: string;
  icon?: any;
  href?: string;
  onClick?: () => void;
  activePattern?: RegExp;
}
