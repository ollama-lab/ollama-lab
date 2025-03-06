import { BASE_URL, type SearchItem, type Tag, type TagType } from "~/lib/contexts/model-search-result";
import { fetch } from "@tauri-apps/plugin-http";

function guessTagTypeByTailwindClasses(className: string): TagType {
  if (className.includes("indigo")) {
    return "category";
  }

  return "parameter";
}

/**
 * Search model
 *
 * This function crawls the HTML/HTMX chunk from Ollama's search page
 * and parses it using the browser's DOM.
 *
 * NOTE: This function returns a promise that returns a generator
 * rather than an async generator.
 *
 * @param keyword Search keyword
 * @returns A promise that returns a generator for search items
 *
 * @author Charles Dong
 * @since 0.1.0
 */
export async function searchModel(keyword: string): Promise<Generator<SearchItem, void, unknown>> {
  const res = await fetch(`${BASE_URL}/search?` + new URLSearchParams({ q: keyword }));
  if (!res.ok) {
    throw new Error(`Fetching error: ${res.status}`);
  }

  const html = await res.text();

  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");

  const listRoot = document.querySelector("#searchresults > ul[role=list]");
  if (!listRoot) {
    throw new Error("No qualified search result list found");
  }

  return (function* () {
    for (const listItem of listRoot.querySelectorAll("li").values()) {
      const link = listItem.querySelector("a");
      if (!link) {
        continue;
      }

      yield {
        name: link.querySelector("div:nth-child(1) > h2 > span")?.innerHTML ?? "",
        description: link.querySelector("div:nth-child(1) > p")?.innerHTML,
        tags: Array.from(link.querySelectorAll("div:nth-child(2) > div > span")).map(
          (item) =>
            ({
              type: guessTagTypeByTailwindClasses(item.className),
              content: item.innerHTML,
            }) satisfies Tag,
        ),
        pulls: link.querySelector("div:nth-child(2) > p > span:nth-child(1) > span:nth-child(1)")?.innerHTML ?? "",
        tagCount: link.querySelector("div:nth-child(2) > p > span:nth-child(2) > span:nth-child(1)")?.innerHTML ?? "",
        updated: link.querySelector("div:nth-child(2) > p > span:nth-child(3) > span:nth-child(1)")?.innerHTML ?? "",
      } satisfies SearchItem;
    }
  })();
}
