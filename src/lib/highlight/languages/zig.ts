import type { Language, LanguageFn } from "highlight.js";

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

  const TYPES = [
    "bool",
    "isize",
    "usize",
    "c_char",
    "c_short",
    "c_int",
    "c_uint",
    "c_long",
    "c_ulong",
    "c_longlong",
    "c_ulonglong",
    "c_longdouble",
    "anyopaque",
    "void",
    "noreturn",
    "type",
    "anyerror",
    "comptime_int",
    "comptime_float",
  ];

  return {
    name: "Zig",
    keywords: {
      keyword: KEYWORDS,
      literal: LITERALS,
      type: TYPES,
    },
    contains: [
      hljs.QUOTE_STRING_MODE,
      hljs.BACKSLASH_ESCAPE,
      {
        scope: "docs",
        begin: /\/\/[/!]/,
        end: "\n",
      },
      hljs.COMMENT("//", "\n"),
      {
        className: "string",
        begin: "\\\\",
        end: "\n",
      },
      {
        className: "number",
        variants: [
          {
            begin: /(0[bo])?[\d_]+/,
          },
          {
            begin: /0x[\d_a-fA-F]+/,
          },
        ],
        relevance: 0,
      },
      {
        className: "type",
        begin: /[iuf]\d+/,
        relevance: 1,
      },
      {
        className: "built_in",
        begin: /@[\d\w_]+/,
      },
    ],
  } satisfies Language;
};

export default zigFn;
