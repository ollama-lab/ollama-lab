import { Element, Root, RootContent } from "hast";
import { h } from "hastscript";
import { bundledLanguages, bundledLanguagesAlias, bundledLanguagesInfo, createHighlighter } from "shiki";
import chatmlLanguage from "./languages/chatml";
import goTemplateLanguage from "./languages/go-template";
import modelfileLanguage from "./languages/modelfile";
import ollamaTemplateLanguage from "./languages/ollama-template";

const LIGHT_THEME = "one-light";
const DARK_THEME = "tokyo-night";

const CUSTOM_LANG_ALIASES = new Map<string, string>([
  ["chatml", "chatml"],
  ["go-template", "go-template"],
  ["gotmpl", "go-template"],
  ["text/template", "go-template"],
  ["modelfile", "modelfile"],
  ["ollama-template", "ollama-template"],
  ["ollama/template", "ollama-template"],
]);

const CUSTOM_LANGUAGE_NAMES = new Set(CUSTOM_LANG_ALIASES.values());
const CUSTOM_LANGUAGE_DISPLAY_NAMES = new Map<string, string>([
  ["chatml", "ChatML"],
  ["go-template", "Go text/template"],
  ["modelfile", "Ollama Model File"],
  ["ollama-template", "Ollama Template"],
]);

const PLAIN_TEXT_ALIASES = new Set(["text", "txt", "plain", "plaintext"]);

const bundledLangAliases = new Set<string>([...Object.keys(bundledLanguages), ...Object.keys(bundledLanguagesAlias)]);

const importFnNameMap = new Map<unknown, string>();
for (const info of bundledLanguagesInfo) {
  importFnNameMap.set(bundledLanguages[info.id as keyof typeof bundledLanguages], info.name);
}

const bundledLanguageDisplayNames = new Map<string, string>();
for (const [key, value] of Object.entries(bundledLanguages)) {
  const displayName = importFnNameMap.get(value);
  if (displayName) {
    bundledLanguageDisplayNames.set(key, displayName);
  }
}

for (const [key, value] of Object.entries(bundledLanguagesAlias)) {
  const displayName = importFnNameMap.get(value);
  if (displayName) {
    bundledLanguageDisplayNames.set(key, displayName);
  }
}

const highlighterPromise = createHighlighter({
  themes: [LIGHT_THEME, DARK_THEME],
  langs: [chatmlLanguage, goTemplateLanguage, modelfileLanguage, ollamaTemplateLanguage],
});

export function shikiThemeFromMode(mode: "light" | "dark") {
  return mode === "light" ? LIGHT_THEME : DARK_THEME;
}

export function normalizeCodeLanguage(lang?: string) {
  if (!lang) {
    return "text";
  }

  const normalized = lang.trim().toLowerCase();
  if (!normalized) {
    return "text";
  }

  if (PLAIN_TEXT_ALIASES.has(normalized)) {
    return "text";
  }

  const custom = CUSTOM_LANG_ALIASES.get(normalized);
  if (custom) {
    return custom;
  }

  if (bundledLangAliases.has(normalized)) {
    return normalized;
  }

  return "text";
}

export function getCodeLanguageDisplayName(lang?: string) {
  const normalized = normalizeCodeLanguage(lang);

  if (normalized === "text") {
    return "Plain Text";
  }

  const customDisplayName = CUSTOM_LANGUAGE_DISPLAY_NAMES.get(normalized);
  if (customDisplayName) {
    return customDisplayName;
  }

  const bundledDisplayName = bundledLanguageDisplayNames.get(normalized);
  if (bundledDisplayName) {
    return bundledDisplayName;
  }

  return normalized;
}

function toClassList(className: unknown) {
  if (typeof className === "string") {
    return className.split(" ");
  }

  if (className instanceof Array) {
    return className.map((item) => item.toString());
  }

  return [] as string[];
}

function asCodeLine(node: Element) {
  const classNames = toClassList(node.properties.className);
  if (!classNames.includes("code-line")) {
    classNames.push("code-line");
  }

  node.properties.className = classNames;

  return node;
}

function findCodeNode(root: Root) {
  const preNode = root.children.find((child): child is Element => child.type === "element" && child.tagName === "pre");
  if (!preNode) {
    return undefined;
  }

  return preNode.children.find((child): child is Element => child.type === "element" && child.tagName === "code");
}

function findPreNode(root: Root) {
  return root.children.find((child): child is Element => child.type === "element" && child.tagName === "pre");
}

function getBackgroundColorFromStyle(style: unknown) {
  if (typeof style !== "string") {
    return undefined;
  }

  const matched = /(?:^|;)\s*background-color\s*:\s*([^;]+)/i.exec(style);
  return matched?.[1]?.trim();
}

export function plainTextToTree(code: string): Root {
  return {
    type: "root",
    children: code.split("\n").map((line) => h("span.code-line", line)) as RootContent[],
  };
}

function extractLineTree(root: Root, fallbackCode: string): Root {
  const codeNode = findCodeNode(root);
  if (!codeNode) {
    return plainTextToTree(fallbackCode);
  }

  const hasElementChildren = codeNode.children.some((child) => child.type === "element");

  const children = codeNode.children.reduce((acc, child) => {
    if (child.type === "element") {
      acc.push(asCodeLine(child));
    } else if (!hasElementChildren && child.type === "text") {
      for (const line of child.value.split("\n")) {
        acc.push(h("span.code-line", line));
      }
    }

    return acc;
  }, [] as RootContent[]);

  return { type: "root", children };
}

export async function highlightCodeToTree(options: { code: string; lang?: string; mode: "light" | "dark" }) {
  const highlighter = await highlighterPromise;
  const normalizedLanguage = normalizeCodeLanguage(options.lang);
  const theme = shikiThemeFromMode(options.mode);

  let resolvedLanguage = normalizedLanguage;
  if (!CUSTOM_LANGUAGE_NAMES.has(normalizedLanguage)) {
    try {
      await highlighter.loadLanguage(normalizedLanguage as Parameters<typeof highlighter.loadLanguage>[0]);
    } catch {
      resolvedLanguage = "text";
    }
  }

  try {
    const highlighted = highlighter.codeToHast(options.code, {
      lang: resolvedLanguage,
      theme,
    }) as Root;
    const preNode = findPreNode(highlighted);
    const backgroundColor = getBackgroundColorFromStyle(preNode?.properties.style);

    return {
      tree: extractLineTree(highlighted, options.code),
      language: resolvedLanguage,
      backgroundColor,
    };
  } catch {
    return {
      tree: plainTextToTree(options.code),
      language: "text",
      backgroundColor: undefined,
    };
  }
}
