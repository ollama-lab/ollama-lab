import { LanguageFn } from "highlight.js";

const modelfileFn: LanguageFn = (hljs) => {
  return {
    name: "Ollama Model File",
    case_insensitive: true,
    keywords: {
      keyword: [
        "FROM",
        "PARAMETER",
        "TEMPLATE",
        "SYSTEM",
        "ADAPTER",
        "LICENSE",
        "MESSAGE",
      ],
    },
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        scope: "string",
        begin: /"""/,
        end: /"""/,
        relevance: 1,
        contains: [
          hljs.BACKSLASH_ESCAPE,
        ],
      },
    ],
  };
};

export default modelfileFn;
