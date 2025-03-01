import { JSX } from "solid-js";

export interface SectionRootProps {
  title?: string;
  children?: JSX.Element;
}

export function SectionRoot(prop: SectionRootProps) {
  return (
    <div class="flex flex-col">
      <h2>{prop.title}</h2>
      <div class="flex flex-col">
        {prop.children}
      </div>
    </div>
  );
}
