import { For } from "solid-js";

export interface ImagePreviewProps {
  srcs: string[];
  onDelete?: (index: number) => void;
}

export function ImagePreview(props: ImagePreviewProps) {
  const srcs = () => props.srcs;

  return (
    <div class="flex gap-2 overflow-x-auto">
      <For each={}></For>
    </div>
  );
}
