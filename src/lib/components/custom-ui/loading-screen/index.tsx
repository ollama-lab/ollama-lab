import { createMemo } from "solid-js";
import { LoaderSpin } from "../../loader-spin";

export interface LoadingScreenProps {
  text?: string;
}

export function LoadingScreen(props: LoadingScreenProps) {
  const text = createMemo(() => props.text ?? "Loading...");

  return (
    <div class="flex items-center place-content-center w-full h-full">
      <LoaderSpin text={text()} />
    </div>
  );
}

