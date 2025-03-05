import { createStore } from "solid-js/store";
import { createMemo, createSignal } from "solid-js";
import { IncomingUserPrompt } from "~/lib/models/chat";
import { getSessionWiseModel } from "./session-wise-model";

const [inputPrompt, setInputPrompt] = createStore<IncomingUserPrompt>({ text: "" });
const [hidePromptBar, setHidePromptBar] = createSignal(false);

export const isSubmittable = createMemo(() => {
  if (!getSessionWiseModel()) {
    return false;
  }

  if (inputPrompt.text.length > 0) {
    return true;
  }

  if (inputPrompt.imagePaths && inputPrompt.imagePaths.length > 0) {
    return true;
  }

  return false;
});

export const getInputPrompt = () => inputPrompt;

export { setInputPrompt, hidePromptBar, setHidePromptBar };
