import { LanguageFn } from "highlight.js";
import { goTextTemplateFn } from "./go-template";

const modelfileFn: LanguageFn = (hljs) => {
  const base = goTextTemplateFn(hljs);

  return {
    name: "Ollama Model File",
  };
};

export default modelfileFn;
