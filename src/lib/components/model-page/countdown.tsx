import { Accessor, createEffect, createSignal, onCleanup, untrack } from "solid-js";

export interface CountdownProps {
  seconds: Accessor<number>;
  expiresAt: Accessor<Date>;
  onTick?: (newSec: number) => void;
  onExpire?: () => void;
}

export function Countdown(props: CountdownProps) {
  const seconds = props.seconds;
  const onTick = props.onTick;
  const expiresAt = props.expiresAt;
  const onExpire = props.onExpire;

  const [expirationTimerId, setExpirationTimerId] = createSignal<number>();

  const countdown = () => {
    onTick?.(Math.floor((expiresAt().getTime() - Date.now()) / 1000));
  };

  createEffect(() => {
    const timerId = untrack(expirationTimerId);

    clearInterval(timerId);
    setExpirationTimerId(undefined);

    countdown();
    setExpirationTimerId(
      setInterval(() => {
        if (seconds() <= 0) {
          onExpire?.();
          clearInterval(expirationTimerId());
          setExpirationTimerId(undefined);
          return;
        }

        countdown();
      }, 1000),
    );
  });

  onCleanup(() => {
    clearInterval(expirationTimerId());
  });

  return <span>{seconds()}</span>;
}
