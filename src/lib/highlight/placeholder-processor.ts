import { h } from "hastscript";

/**
 * A simple processor splitting code by lines
 * and wrapping them into HAST.
 *
 * Used when Shiki has not yet been loaded onto the edge.
 */
export function placeholderProcessor(code: string) {
  return [h("pre", h("code", code))];
}
