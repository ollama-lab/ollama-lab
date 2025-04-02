import { createStore } from "solid-js/store";
import { IncomingUserPrompt, incomingUserPromptSchema } from "~/lib/schemas/chat";
import { getCurrentModel } from "./current-model";
import { SessionMode } from "~/lib/schemas/session";

const [inputPrompt, setInputPrompt] = createStore<IncomingUserPrompt>(incomingUserPromptSchema.parse({ text: "" }));

export const isSubmittable = (mode: SessionMode) => {
  if (!getCurrentModel(mode)) {
    return false;
  }

  if (inputPrompt.text.length > 0 || mode === "h2h") {
    return true;
  }

  if (inputPrompt.imagePaths && inputPrompt.imagePaths.length > 0) {
    return true;
  }

  return false;
};

export const getInputPrompt = () => inputPrompt;
export const clearInputPrompt = () => setInputPrompt(incomingUserPromptSchema.parse({ text: "" }));

export { setInputPrompt };
