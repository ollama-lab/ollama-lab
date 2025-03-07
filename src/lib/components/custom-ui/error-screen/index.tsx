import { Component } from "solid-js";

const ErrorScreen: Component<{
  item: Error | string;
}> = (props) => {
  return (
    <div class="w-full h-dvh flex flex-col items-center place-content-center">
      <span>{String(props.item)}</span>
    </div>
  );
}

export default ErrorScreen;
