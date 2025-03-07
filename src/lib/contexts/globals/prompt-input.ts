import { createStore } from "solid-js/store";
import { createMemo, createSignal } from "solid-js";
import { IncomingUserPrompt } from "~/lib/models/chat";
import { getCurrentModel } from "./current-model";

const [inputPrompt, setInputPrompt] = createStore<IncomingUserPrompt>({ text: "" });
const [hidePromptBar, setHidePromptBar] = createSignal(false);

export const isSubmittable = createMemo(() => {
  if (!getCurrentModel()) {
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
export const clearInputPrompt = () => setInputPrompt({ text: "" });

export { setInputPrompt, hidePromptBar, setHidePromptBar };
