import { createMemo, createSignal, For, Match, Show, Suspense, Switch } from "solid-js";
import { Button } from "~/lib/components/ui/button";
import { CloudDownloadIcon } from "lucide-solid";
import { CommandDialog, CommandGroup, CommandInput, CommandList } from "~/lib/components/ui/command";
import { BASE_DOMAIN, BASE_URL, useModelSearchResult } from "~/lib/contexts/model-search-result";
import { openUrl } from "@tauri-apps/plugin-opener";
import { Motion, Presence } from "solid-motionone";
import { platform } from "@tauri-apps/plugin-os";
import { LoaderSpin } from "../../loader-spin";
import { SearchResultItem } from "./search-result-item";

interface HintsProps {
  searchEntered?: boolean;
}

function Hints(props: HintsProps) {
  const searchEntered = () => props.searchEntered;

  const os = createMemo(() => platform());

  return (
    <Show when={searchEntered()}>
      <Motion.div
        class="flex gap-2 md:gap-4 lg:gap-6 text-xs px-2 py-2"
        transition={{ duration: 300 }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 1 }}
      >
        <span class="flex gap-2 items-center">
          <span class="z-[1]"><kbd>Enter</kbd></span>
          Search
        </span>
        <span class="flex gap-2 items-center">
          <span>
            <Switch fallback={<><kbd>Ctrl</kbd> + <kbd>Enter</kbd></>}>
              <Match when={os() === "macos" || os() === "ios"}>
                <kbd>{"\u2318" /* Command key symbol */} Enter</kbd>
              </Match>
            </Switch>
          </span>
          <span>Pull entered anyway</span>
        </span>
      </Motion.div>
    </Show>
  );
}

export function PullModel() {
  const searchResultContext = useModelSearchResult();

  const keyword = () => searchResultContext?.keyword() ?? "";
  const searchResult = () => searchResultContext?.searchResult;
  const initiateSearch = (keyword: string) => searchResultContext?.initiateSearch(keyword);

  const [open, setOpen] = createSignal(false);

  const [inputKeyword, setInputKeyword] = createSignal<string>(keyword());

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        title="Pull model"
        onClick={() => setOpen(true)}
      >
        <CloudDownloadIcon />
      </Button>

      <CommandDialog open={open()} onOpenChange={setOpen}>
        <CommandInput
          placeholder={`Search models on ${BASE_DOMAIN}`}
          disabled={searchResult()?.loading}
          value={inputKeyword()}
          onValueChange={setInputKeyword}
          on:keydown={(ev) => {
            if (ev.key === "End") {
              ev.preventDefault()
              ev.stopPropagation()
              const value = ev.currentTarget.value
              ev.currentTarget.setSelectionRange(value.length, value.length)
              return
            }

            if (ev.key === "Home") {
              ev.preventDefault()
              ev.stopPropagation()
              ev.currentTarget.setSelectionRange(0, 0)
            }

            if (ev.key === "Enter") {
              ev.preventDefault()

              if (ev.ctrlKey) {
                searchResultContext?.startPullModel(keyword());
                setInputKeyword("");
              } else {
                initiateSearch(keyword());
              }
            }
          }}
        />

        <div class="flex">
          <Button
            variant="link"
            size="sm"
            class="text-xs flex gap-0"
            onClick={() => {
              const kw = keyword();
              openUrl(kw.length > 0 ? `${BASE_URL}/search?` + new URLSearchParams({ q: kw }) : BASE_URL);
            }}
          >
            <span class="z-[1]">Visit {BASE_DOMAIN}</span>
              <Presence exitBeforeEnter>
                <Show when={inputKeyword().trim()}>
                  {(kw) => (
                    <Show when={kw().length > 0}>
                      <Motion.span
                        class="-ml-[1pt]"
                        transition={{ duration: 300 }}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                      >
                        &nbsp;with "{kw()}"
                      </Motion.span>
                    </Show>
                  )}
                </Show>
              </Presence>
          </Button>
        </div>

        <Hints searchEntered={inputKeyword().trim().length > 0} />

        <CommandList>
          <Suspense fallback={(
            <div class="px-2 py-2 text-sm">
              <LoaderSpin text="Searching..." />
            </div>
          )}>
            <Show when={searchResult()}>
              {(s) => (
                <CommandGroup heading="Search result">
                  <For each={s()()?.result}>
                    {(item) => (
                      <SearchResultItem item={item} />
                    )}
                  </For>
                </CommandGroup>
              )}
            </Show>
          </Suspense>
        </CommandList>
      </CommandDialog>
    </>
  );
}
