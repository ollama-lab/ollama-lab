import { Component, createMemo } from "solid-js";
import { LoaderSpin } from "../../loader-spin";

export const LoadingScreen: Component<{
  text?: string;
}> = (props) => {
  const text = createMemo(() => props.text ?? "Loading...");

  return (
    <div class="flex items-center place-content-center w-full h-full">
      <LoaderSpin text={text()} />
    </div>
  );
}
