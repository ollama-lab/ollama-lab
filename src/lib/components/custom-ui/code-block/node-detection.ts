import { Element } from "hast";

/**
 * @see https://github.com/rehypejs/rehype-highlight/blob/main/lib/index.js#L154
 */
export function language(node: Element) {
  const list = node.properties.className;
  let index = -1;

  if (!Array.isArray(list)) {
    return;
  }

  let name: string | undefined;

  while (++index < list.length) {
    const value = String(list[index]);

    if (value === 'no-highlight' || value === 'nohighlight') {
      return false;
    }

    if (!name && value.slice(0, 5) === 'lang-') {
      name = value.slice(5);
    }

    if (!name && value.slice(0, 9) === 'language-') {
      name = value.slice(9);
    }
  }

  return name;
}
