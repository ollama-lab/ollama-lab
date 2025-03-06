import type { Element } from "hast";

export function language(node: Element) {
  const className = node.properties.className;
  if (!className) {
    return undefined;
  }

  const classList = typeof className === "string" ? className.split(" ") : className;
  if (!(classList instanceof Array)) {
    return undefined;
  }

  for (const className of classList) {
    const matched = className.toString().match(/^language-\w+$/);
    if (!matched) {
      continue;
    }

    const matchedClass = matched.at(0);
    if (!matchedClass) {
      continue;
    }

    return matchedClass.replace("language-", "");
  }

  return undefined;
}
