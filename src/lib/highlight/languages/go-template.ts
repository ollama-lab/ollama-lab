import { LanguageFn } from "highlight.js";

const goTextTemplateFn: LanguageFn = (hljs) => {
  return {
    name: "Go text/template",
    contains: [
      {
        starts: /\{\{/,
        end: /\}\}/,
        keywords: {
          keyword: [
            "break",
            "case",
            "chan",
            "const",
            "continue",
            "default",
            "defer",
            "define",
            "else",
            "end",
            "fallthrough",
            "for",
            "func",
            "go",
            "goto",
            "if",
            "import",
            "interface",
            "map",
            "package",
            "range",
            "return",
            "select",
            "struct",
            "switch",
            "template",
            "type",
            "var",
          ],
          type: [
            "bool",
            "byte",
            "complex64",
            "complex128",
            "error",
            "float32",
            "float64",
            "int8",
            "int16",
            "int32",
            "int64",
            "string",
            "uint8",
            "uint16",
            "uint32",
            "uint64",
            "int",
            "uint",
            "uintptr",
            "rune",
          ],
          built_in: [
            "and",
            "call",
            "html",
            "index",
            "slice",
            "js",
            "len",
            "not",
            "or",
            "print",
            "printf",
            "println",
            "urlquery",
            "eq",
            "ne",
            "lt",
            "le",
            "gt",
            "ge",
          ],
        },
        contains: [
          {
            scope: "meta keyword",
            match: /(\{\{|\}\})/,
          },
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.QUOTE_STRING_MODE,
          {
            scope: "built_in",
            match: /-/,
            relevance: -1,
          },
          {
            scope: "punctuation",
            match: /\$/,
            contains: [
              {
                scope: "variable",
                match: /[\w\d_]+/,
              },
            ],
          },
          {
            scope: "punctuation",
            match: /\./,
            contains: [
              {
                scope: "property",
                match: /[\w\d_]+/,
              }
            ],
          },
        ],
      },
    ],
  };
};

export default goTextTemplateFn;
