import hljs from "highlight.js";
import { all } from "lowlight";
import chatmlFn from "~/lib/highlight/languages/chatml";
import { goTextTemplateFn } from "~/lib/highlight/languages/go-template";
import modelfileFn from "~/lib/highlight/languages/modelfile";
import ollamaTemplateFn from "~/lib/highlight/languages/ollama-template";
import zigFn from "~/lib/highlight/languages/zig";

const langs = {
  "chatml": chatmlFn,
  "text/template": goTextTemplateFn,
  "modelfile": modelfileFn,
  "ollama/template": goTextTemplateFn,
  "zig": zigFn,
};

for (const [lang, fn] of Object.entries(langs)) {
  hljs.registerLanguage(lang, fn);
}

export const allLangs = {
  ...all,
  ...langs,
};
