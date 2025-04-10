import dayjs from "dayjs";
import { Component, createSignal, onCleanup, onMount } from "solid-js";

const RelativeTime: Component<{
  date: Date;
}> = (props) => {
  const date = () => props.date;

  const updateTimeDelta = () => {
    return Math.floor((Date.now() - date().getTime()) / 1000);
  };

  const updateRelativeTime = () => {
    return dayjs(date()).fromNow();
  };

  const [timerId, setTimerId] = createSignal<number>();
  const [display, setDisplay] = createSignal<string>(updateRelativeTime());

  const getNextUpdateInterval = () => {
    const delta = updateTimeDelta();

    if (delta < 60) {
      return 1_000;
    }

    if (delta < 3_600) {
      return 60_000;
    }

    if (delta < 86_400) {
      return 3_600_000;
    }

    return 86_400_000;
  };

  const setRecursiveTimer = () => {
    setTimerId(
      setTimeout(() => {
        setDisplay(updateRelativeTime());
        setRecursiveTimer();
      }, getNextUpdateInterval()),
    );
  };

  onMount(() => {
    setRecursiveTimer();
  });

  onCleanup(() => {
    clearTimeout(timerId());
  });

  return <span title={date().toLocaleString()}>{display()}</span>;
}

export default RelativeTime;
