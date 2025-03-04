import { createSignal } from "solid-js";
import { Button } from "../ui/button";
import { CloudDownloadIcon } from "lucide-solid";
import { CommandDialog, CommandInput } from "../ui/command";
import { BASE_DOMAIN, useModelSearchResult } from "~/lib/contexts/model-search-result";

export function PullModel() {
  const searchResultContext = useModelSearchResult();

  const keyword = () => searchResultContext?.keyword() ?? "";
  const searchResult = () => searchResultContext?.searchResult;
  const initiateSearch = (keyword: string) => searchResultContext?.initiateSearch(keyword);

  const [open, setOpen] = createSignal(false);

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
              } else {
                initiateSearch(keyword());
              }
            }
          }}
        />
      </CommandDialog>
    </>
  );
}
