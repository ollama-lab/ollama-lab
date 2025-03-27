import { Component, createEffect, createSignal, onCleanup, Show } from "solid-js";

const TRIGGER_IN_TIMES = 10;

export const PlaceholderTitle: Component = () => {
  const defaultText = "Oh llama, your llama. 🦙";
  const eggTextBase64 = "RGV2aWFudHMsIGZhc2NpbmF0aW5nIGFyZW4ndCB0aGV5Pwo=";

  const [clickedTimes, setClickedTimes] = createSignal(0);
  const [eggTriggered, setEggTriggered] = createSignal(false);

  const [timerId, setTimerId] = createSignal<number | null>(null);

  const clearTimer = () => {
    const t = timerId();
    if (t !== null) {
      clearTimeout(t);
    }
  };

  const resetTimer = () => {
    clearTimer();
    setTimeout(() => {
      setClickedTimes(0);
      setTimerId(null);
    }, 5_000);
  };

  onCleanup(() => {
    clearTimer();
  });

  createEffect(() => {
    const ct = clickedTimes();

    if (ct >= TRIGGER_IN_TIMES) {
      setEggTriggered(true);
      clearTimer();
    } else if (ct > 0) {
      resetTimer();
    }
  });

  return (
    <span
      class="font-bold text-2xl select-none cursor-pointer"
      onClick={() => {
        if (eggTriggered()) {
          return;
        }

        setClickedTimes((cur) => cur + 1);
      }}
    >
      <Show when={eggTriggered()} fallback={defaultText}>
        {atob(eggTextBase64) + " 😏"}
      </Show>
    </span>
  );
}

export const PlaceholderPage: Component = () => {
  return (
    <div class="flex flex-col items-center place-content-center h-full">
      <PlaceholderTitle />
    </div>
  );
}
