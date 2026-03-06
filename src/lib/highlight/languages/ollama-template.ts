const ollamaTemplateLanguage = {
  name: "ollama-template",
  displayName: "Ollama Template",
  scopeName: "source.ollama-template",
  aliases: ["ollama/template"],
  patterns: [
    {
      include: "source.go-template",
    },
    {
      include: "source.chatml",
    },
    {
      match: "<(\\/)?[\\w\\d_]+>",
      name: "entity.name.tag.ollama-template",
    },
  ],
  repository: {},
};

export default ollamaTemplateLanguage;
