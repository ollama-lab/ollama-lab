import { createMemo, Show } from "solid-js";
import { useChatEntry } from "~/lib/contexts/chat-entry";

export function BubbleSectorFooterMetrics() {
  const chat = useChatEntry();

  const tokPerSec = createMemo(() => {
    const c = chat?.();
    if (!c?.evalCount || !c.evalDuration || c.evalDuration <= 0) {
      return undefined;
    }

    return c.evalCount / (c.evalDuration / 1_000_000_000);
  });

  const totalDuration = createMemo(() => {
    const total = chat?.()?.totalDuration;
    if (!total || total <= 0) {
      return undefined;
    }

    const ms = total / 1_000_000;
    if (ms < 1000) {
      return `${ms.toFixed(0)}ms`;
    }

    const sec = ms / 1000;
    if (sec < 60) {
      return `${sec.toFixed(1)}s`;
    }

    return `${(sec / 60).toFixed(1)}m`;
  });

  const text = createMemo(() => {
    const tps = tokPerSec();
    const total = totalDuration();
    if (!tps && !total) {
      return undefined;
    }

    if (tps && total) {
      return `${tps.toFixed(1)} tok/s · ${total}`;
    }

    if (tps) {
      return `${tps.toFixed(1)} tok/s`;
    }

    return total;
  });

  return <Show when={text()}>{(value) => <span>{value()}</span>}</Show>;
}
