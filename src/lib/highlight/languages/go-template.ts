const KEYWORDS = [
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
];

const TYPES = [
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
];

const BUILT_INS = [
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
];

const joinWordPattern = (words: string[]) => `\\b(?:${words.join("|")})\\b`;

const goTemplateLanguage = {
  name: "go-template",
  displayName: "Go text/template",
  scopeName: "source.go-template",
  aliases: ["text/template", "gotmpl"],
  patterns: [
    {
      begin: "(\\{\\{)",
      beginCaptures: {
        1: { name: "punctuation.definition.template.begin.go-template" },
      },
      end: "(\\}\\})",
      endCaptures: {
        1: { name: "punctuation.definition.template.end.go-template" },
      },
      name: "meta.template.go-template",
      patterns: [
        { include: "#blockComment" },
        { include: "#string" },
        { include: "#variable" },
        { include: "#property" },
        { include: "#trimMarker" },
        { include: "#keywords" },
      ],
    },
  ],
  repository: {
    blockComment: {
      begin: "/\\*",
      end: "\\*/",
      name: "comment.block.go-template",
    },
    string: {
      begin: '"',
      end: '"',
      name: "string.quoted.double.go-template",
      patterns: [
        {
          match: "\\\\.",
          name: "constant.character.escape.go-template",
        },
      ],
    },
    variable: {
      match: "\\$[\\w\\d_]+",
      name: "variable.other.go-template",
    },
    property: {
      match: "\\.[\\w\\d_]+",
      name: "variable.other.property.go-template",
    },
    trimMarker: {
      match: "-",
      name: "keyword.operator.go-template",
    },
    keywords: {
      patterns: [
        {
          match: joinWordPattern(KEYWORDS),
          name: "keyword.control.go-template",
        },
        {
          match: joinWordPattern(TYPES),
          name: "storage.type.go-template",
        },
        {
          match: joinWordPattern(BUILT_INS),
          name: "support.function.builtin.go-template",
        },
      ],
    },
  },
};

export default goTemplateLanguage;
