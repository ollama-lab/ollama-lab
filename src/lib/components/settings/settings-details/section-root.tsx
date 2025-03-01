import { createMemo, JSX, Show } from "solid-js";

export interface SectionRootProps {
  title?: string;
  children?: JSX.Element;
}

export function SectionRoot(prop: SectionRootProps) {
  const title = createMemo(() => prop.title);

  return (
    <div class="flex flex-col gap-2">
      <Show when={!!title()}>
        <h2>{title()}</h2>
      </Show>
      <div class="flex flex-col gap-2">
        {prop.children}
      </div>
    </div>
  );
}
