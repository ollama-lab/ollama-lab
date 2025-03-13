import hljs from "highlight.js";

const langs = {
  "chatml": (await import("~/lib/highlight/languages/chatml")).default,
  "text/template": (await import("~/lib/highlight/languages/go-template")).default,
  "modelfile": (await import("~/lib/highlight/languages/modelfile")).default,
  "ollama/template": (await import("~/lib/highlight/languages/ollama-template")).default,
  "zig": (await import("~/lib/highlight/languages/zig")).default,
};

for (const [lang, fn] of Object.entries(langs)) {
  hljs.registerLanguage(lang, fn);
}

export const allLangs = {
  ...(await import("lowlight")).all,
  ...langs,
};
