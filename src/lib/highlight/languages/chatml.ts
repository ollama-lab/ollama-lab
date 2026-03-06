const chatmlLanguage = {
  name: "chatml",
  displayName: "ChatML",
  scopeName: "source.chatml",
  aliases: [],
  patterns: [
    {
      begin: "(<\\|im_start\\|>)",
      beginCaptures: {
        1: { name: "keyword.control.chatml" },
      },
      end: "(<\\|im_end\\|>)",
      endCaptures: {
        1: { name: "keyword.control.chatml" },
      },
      name: "meta.block.chatml",
    },
    {
      match: "<(\\/)?[\\w\\d_]+>",
      name: "entity.name.tag.chatml",
    },
  ],
  repository: {},
};

export default chatmlLanguage;
