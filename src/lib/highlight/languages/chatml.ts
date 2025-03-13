import { LanguageFn } from "highlight.js";

const chatmlFn: LanguageFn = () => {
  return {
    name: "ChatML",
    contains: [
      {
        starts: /<\|im_start\|>/,
        end: /<\|im_end\|>/,
        keywords: {
          built_in: [
            "<|im_start|>",
            "<|im_end|>",
          ],
        },
        contains: [
        ],
      },
      {
        scope: "tag",
        match: /<(\/)?[\w\d_]+>/,
      },
    ],
  };
};

export default chatmlFn;
