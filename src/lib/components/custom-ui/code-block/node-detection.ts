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
    const classString = className.toString();
    const matched = classString.startsWith("language-");
    if (!matched) {
      continue;
    }

    return classString.slice(9);
  }

  return undefined;
}
