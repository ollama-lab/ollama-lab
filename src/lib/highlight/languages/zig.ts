import type { LanguageFn } from "highlight.js";

const zigFn: LanguageFn = (hljs) => {

  /**
   * @see https://ziglang.org/documentation/master/#toc-Keyword-Reference
   */
  const KEYWORDS = [
    "addrspace",
    "align",
    "allowzero",
    "and",
    "anyframe",
    "anytype",
    "asm",
    "async",
    "await",
    "break",
    "callconv",
    "catch",
    "comptime",
    "const",
    "continue",
    "defer",
    "else",
    "enum",
    "errdefer",
    "error",
    "export",
    "extern",
    "fn",
    "for",
    "if",
    "inline",
    "linksection",
    "noalias",
    "noinline",
    "nosuspend",
    "opaque",
    "or",
    "orelse",
    "packed",
    "pub",
    "resume",
    "return",
    "struct",
    "suspend",
    "switch",
    "test",
    "threadlocal",
    "try",
    "union",
    "unreachable",
    "usingnamespace",
    "var",
    "volatile",
    "while",
  ];

  const LITERALS = [
    "true",
    "false",
    "null",
    "undefined",
  ];

  return {
    name: "Zig",
    aliases: ["zig"],
    keywords: {
      keyword: KEYWORDS,
      literal: LITERALS,
      builtin: /@[\w\d_]+/,
    },
    contains: [
      hljs.QUOTE_STRING_MODE,
      {
        scope: "docs",
        begin: /\/\/[/!]/,
        end: "\n",
      },
      hljs.COMMENT("//", "\n"),
    ],
  };
};

export default zigFn;
