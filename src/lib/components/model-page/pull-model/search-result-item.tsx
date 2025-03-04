import { SearchItem, useModelSearchResult } from "~/lib/contexts/model-search-result";
import { CommandItem } from "../../ui/command";
import { createMemo, createSignal } from "solid-js";
import { modelList } from "~/lib/contexts/globals/model-states";
import { getTaskMap } from "~/lib/contexts/globals/pull-model-tasks";
import { For, JSX, Match, Switch } from "solid-js";
import { cn } from "~/lib/utils/class-names";
import { Button } from "../../ui/button";
import { LoaderSpin } from "../../loader-spin";
import { CloudDownloadIcon } from "lucide-solid";

interface TagBadgeProps {
  children?: JSX.Element;
  class?: string;
  "on:click"?: (ev: MouseEvent) => void;
}

function TagBadge(props: TagBadgeProps) {
  const clickHandler = (ev: MouseEvent) => props["on:click"]?.(ev);

  return (
    <span class={cn("text-xs px-2 py-1 rounded-lg", props.class)} on:click={clickHandler}>
      {props.children}
    </span>
  );
}

export interface SearchResultItemProps {
  item: SearchItem;
}

export function SearchResultItem(props: SearchResultItemProps) {
  const LATEST = "latest";

  const searchResultContext = useModelSearchResult();

  const searchItem = () => props.item;

  const [selected, setSelected] = createSignal<string>(LATEST);
  const fullName = createMemo(() => `${props.item}:${selected()}`);

  const downloadedAlready = createMemo(() => {
    const modelName = fullName();
    return modelList().filter(({ name }) => name === modelName).length > 0;
  });
  const downloading = createMemo(() => Object.keys(getTaskMap()).includes(fullName()));

  return (
    <CommandItem onClick={() => setSelected(LATEST)} class="flex flex-col">
      <div class="flex flex-col gap-2 w-full">
        <span class="font-bold">{searchItem().name}</span>
        <span class="whitespace-pre-wrap flex-wrap">{searchItem().description}</span>
      </div>
      <div class="flex gap-2 w-full">
        <div class="flex gap-2 items-center">
          <For each={searchItem().tags}>
            {(tag) => (
              <Switch>
                <Match when={tag.type === "category"}>
                  <TagBadge class="bg-fuchsia-200/80 dark:bg-fuchsia-900/80">{tag.content}</TagBadge>
                </Match>
                <Match when={tag.type === "parameter"}>
                  <TagBadge
                    class={cn(
                      "bg-sky-200/80 dark:bg-sky-900/80 hover:bg-sky-300 dark:hover:bg-sky-800 cursor-pointer",
                      selected() === tag.content && "bg-sky-400 dark:bg-sky-700",
                    )}
                    on:click={(ev) => {
                      ev.stopPropagation();
                      setSelected(tag.content);
                    }}
                  >
                    {tag.content}
                  </TagBadge>
                </Match>
              </Switch>
            )}
          </For>
        </div>
        <div class="grow" />
        <div class="flex gap-2 lg:gap-4 place-content-end text-xs items-center">
          <span>Selected: {selected()}</span>
          <Button
            size="icon"
            variant="ghost"
            on:click={(ev) => {
              ev.stopPropagation();
              searchResultContext?.startPullModel(fullName());
            }}
            disabled={downloadedAlready()}
          >
            <Switch
              fallback={<CloudDownloadIcon class={cn("size-4", downloadedAlready() && "text-muted-foreground")} />}
            >
              <Match when={downloading()}>
                <LoaderSpin class="size-4" />
              </Match>
            </Switch>
          </Button>
        </div>
      </div>
    </CommandItem>
  );
}
