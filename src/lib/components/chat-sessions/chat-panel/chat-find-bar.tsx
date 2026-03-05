import { ChevronDownIcon, ChevronUpIcon, SearchIcon, XIcon } from "lucide-solid";
import { Component } from "solid-js";
import { Button } from "~/lib/components/ui/button";

interface ChatFindBarProps {
  query: string;
  currentMatch: number;
  totalMatches: number;
  onQueryInput: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  inputRef?: (el: HTMLInputElement) => void;
}

export const ChatFindBar: Component<ChatFindBarProps> = (props) => {
  return (
    <div class="sticky top-0 z-30 w-full py-2">
      <div class="flex items-center gap-1.5 rounded-md border bg-background/95 backdrop-blur px-2 py-1.5 shadow-sm">
        <SearchIcon class="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={props.inputRef}
          type="search"
          value={props.query}
          onInput={(ev) => props.onQueryInput(ev.currentTarget.value)}
          placeholder="Find in conversation"
          class="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              if (ev.shiftKey) {
                props.onPrevious();
              } else {
                props.onNext();
              }
            }
          }}
        />
        <span class="shrink-0 text-xs text-muted-foreground tabular-nums px-1">
          {props.totalMatches === 0 ? "0/0" : `${props.currentMatch}/${props.totalMatches}`}
        </span>
        <Button size="icon" variant="ghost" class="size-7" title="Previous match" onClick={props.onPrevious}>
          <ChevronUpIcon class="size-4" />
        </Button>
        <Button size="icon" variant="ghost" class="size-7" title="Next match" onClick={props.onNext}>
          <ChevronDownIcon class="size-4" />
        </Button>
        <Button size="icon" variant="ghost" class="size-7" title="Close find" onClick={props.onClose}>
          <XIcon class="size-4" />
        </Button>
      </div>
    </div>
  );
};
