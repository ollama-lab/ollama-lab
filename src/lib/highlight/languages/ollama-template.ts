import { LanguageFn } from "highlight.js";

const ollamaTemplateFn: LanguageFn = (hljs) => {
  return {
    name: "Ollama Template",
  };
};

export default ollamaTemplateFn;
