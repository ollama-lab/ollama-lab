import hljs from "highlight.js";
import { all } from "lowlight";
import zigFn from "~/lib/highlight/languages/zig";

const langs = {
  "zig": zigFn,
};

for (const [lang, fn] of Object.entries(langs)) {
  hljs.registerLanguage(lang, fn);
}

export const allLangs = {
  ...all,
  ...langs,
};
