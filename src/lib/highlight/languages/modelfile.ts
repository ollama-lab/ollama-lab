const modelfileLanguage = {
  name: "modelfile",
  displayName: "Ollama Model File",
  scopeName: "source.modelfile",
  aliases: [],
  patterns: [
    {
      match: "#.*$",
      name: "comment.line.number-sign.modelfile",
    },
    {
      begin: '"""',
      end: '"""',
      name: "string.quoted.triple.modelfile",
      patterns: [
        {
          match: "\\\\.",
          name: "constant.character.escape.modelfile",
        },
      ],
    },
    {
      match: "\\b(?i:FROM|PARAMETER|TEMPLATE|SYSTEM|ADAPTER|LICENSE|MESSAGE)\\b",
      name: "keyword.control.modelfile",
    },
  ],
  repository: {},
};

export default modelfileLanguage;
