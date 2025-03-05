import { createMemo, createResource, For, Suspense } from "solid-js";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { TrashIcon } from "lucide-solid";

export interface ImageInfoReturn {
  result: string;
  origin: string;
}

export interface ImagePreviewProps {
  srcs: string[];
  fetcher?: (src: string) => ImageInfoReturn | Promise<ImageInfoReturn>;
  onDelete?: (index: number) => void;
}

export function ImagePreview(props: ImagePreviewProps) {
  const srcs = createMemo(() => {
    const fetcher = props.fetcher ?? ((src) => ({ result: src, origin: src }));

    return props.srcs.map((src) => createResource(src, fetcher));
  });

  return (
    <div class="flex gap-2 overflow-x-auto">
      <For each={srcs()}>
        {([src], i) => (
          <div>
            <div class="group relative flex flex-col gap-1 overflow-auto cursor-pointer border border-border px-0.5 py-0.5 min-w-40">
              <div class="max-h-[200px]">
                <Suspense fallback={<Skeleton width={200} height={200} radius={6} />}>
                  <img src={src()?.result} alt="N/A" title={src()?.origin} />
                </Suspense>
              </div>

              <Button
                variant="destructive"
                class="absolute top-0 right-0 rounded-full size-8 opacity-0 group-hover:opacity-100"
                size="icon"
                on:click={(ev) => {
                  ev.stopPropagation();
                  props.onDelete?.(i());
                }}
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
