import { ChevronsUpDownIcon } from "lucide-solid";
import { createEffect, createMemo, createSignal } from "solid-js";
import { toast } from "solid-sonner";
import { initModelStates, modelList } from "~/lib/contexts/globals/model-states";
import { getSessionWiseModel, setSessionWiseModel } from "~/lib/contexts/globals/session-wise-model";
import { ModelListItem } from "~/lib/models/model-item";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { For } from "solid-js";

export function ModelSelector() {
  const [open, setOpen] = createSignal(false);

  const groupedModelList = createMemo(() => {
    return modelList().reduce(
      (acc, cur) => {
        const prefix = cur.name.split(":").at(0) ?? "Misc";
        acc[prefix] = [...(acc[prefix] ?? []), cur];
        return acc;
      },
      {} as Record<string, ModelListItem[]>,
    );
  });

  createEffect(() => {
    initModelStates().catch((err) => toast.error(String(err)));
  });

  const updateSessionModel = async (model: string) => {
    await setSessionWiseModel(model);
    setOpen(false);
  };

  return (
    <>
      <button class="flex gap-2 px-4 h-full items-center cursor-pointer" onClick={() => setOpen(true)}>
        <span class="grow truncate text-start w-36 text-sm">{getSessionWiseModel()}</span>
        <ChevronsUpDownIcon class="size-4" />
      </button>

      <CommandDialog open={open()} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search local models" />

          <CommandList>
            <CommandEmpty>No matched model found.</CommandEmpty>
            <For each={Object.entries(groupedModelList())}>
              {([prefix, list]) => (
                <CommandGroup heading={prefix}>
                  <For each={list}>
                    {(item) => (
                      <CommandItem class="cursor-pointer" on:click={() => updateSessionModel(item.name)}>
                        {item.name}
                      </CommandItem>
                    )}
                  </For>
                </CommandGroup>
              )}
            </For>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
