import { Accessor, createEffect, onCleanup } from "solid-js";

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

  // Direct value in purpose
  let expirationTimerId: number | undefined = undefined;

  const countdown = () => {
    onTick?.(Math.floor((expiresAt().getTime() - Date.now()) / 1000));
  }

  createEffect(() => {
    clearInterval(expirationTimerId);
    expirationTimerId = undefined;

    countdown();
    expirationTimerId = setInterval(() => {
      if (seconds() <= 0) {
        onExpire?.();
        clearInterval(expirationTimerId);
        expirationTimerId = undefined;
        return;
      }

      countdown();
    }, 1000);
  });

  onCleanup(() => {
    clearInterval(expirationTimerId);
  });

  return (
    <span>{seconds()}</span>
  );
}
