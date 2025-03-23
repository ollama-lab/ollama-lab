import { Accessor, createMemo } from "solid-js";

export interface InputNames {
  name?: string | null;
  model: string;
}

export function getDisplayName(name?: string, model?: string) {
  return name ?? model;
}

export function createDisplayNames(itemFn: Accessor<InputNames | undefined>) {
  const ret = createMemo(() => {
    const item = itemFn();

    return {
      displayName: item ? getDisplayName(item.name ?? undefined, item.model) : undefined,
      displayModel: item?.name ? item.model : undefined,
    };
  });

  return ret;
}
