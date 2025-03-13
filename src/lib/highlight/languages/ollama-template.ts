import { LanguageFn } from "highlight.js";
import { goTextTemplateFn } from "./go-template";
import chatmlFn from "./chatml";

const ollamaTemplateFn: LanguageFn = (hljs) => {
  const base1 = goTextTemplateFn(hljs);
  const base2 = chatmlFn(hljs);

  return {
    name: "Ollama Template",
    keywords: base1.keywords,
    contains: [
      ...base1.contains,
      ...base2.contains,
    ],
  };
};

export default ollamaTemplateFn;
