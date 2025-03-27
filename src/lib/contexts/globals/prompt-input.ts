import { createStore } from "solid-js/store";
import { IncomingUserPrompt } from "~/lib/models/chat";
import { getCurrentModel } from "./current-model";
import { isH2h } from "./settings";
import { SessionMode } from "~/lib/models/session";

const [inputPrompt, setInputPrompt] = createStore<IncomingUserPrompt>({ text: "" });

export const isSubmittable = (mode: SessionMode) => {
  if (!getCurrentModel(mode)) {
    return false;
  }

  if (inputPrompt.text.length > 0 || isH2h()) {
    return true;
  }

  if (inputPrompt.imagePaths && inputPrompt.imagePaths.length > 0) {
    return true;
  }

  return false;
};

export const getInputPrompt = () => inputPrompt;
export const clearInputPrompt = () => setInputPrompt({ text: "", imagePaths: [] });

export { setInputPrompt };
