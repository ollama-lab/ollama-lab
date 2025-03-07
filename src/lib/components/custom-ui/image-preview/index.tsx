import { Component, createMemo, createResource, For, Suspense } from "solid-js";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { TrashIcon } from "lucide-solid";
import { createAsync } from "@solidjs/router";
import { getImagesByChatId } from "~/lib/commands/image";
import { toSrcString } from "~/lib/utils/images";

export interface ImageInfoReturn {
  result: string;
  origin: string;
}

export const ImagePreview: Component<{
  srcs: string[];
  fetcher?: (src: string) => ImageInfoReturn | Promise<ImageInfoReturn>;
  onDelete?: (index: number) => void;
}> = (props) => {
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

export const ChatImagePreview: Component<{
  chatId: number;
}> = (props) => {
  const chatId = () => props.chatId;

  const images = createAsync(async () => await getImagesByChatId(chatId()));

  return (
    <div class="flex gap-2 overflow-x-auto">
      <Suspense fallback={<Skeleton width={160} height={160} />}>
        <For each={images()}>
          {(image) => (
            <div>
              <div class="group relative flex flex-col gap-1 overflow-auto cursor-pointer border border-border px-0.5 py-0.5 min-w-40">
                <div class="max-h-[160px]">
                  <img src={toSrcString(image.mime, image.base64)} alt="N/A" title={image.origin ?? undefined} />
                </div>
              </div>
            </div>
          )}
        </For>
      </Suspense>
    </div>
  );
}
