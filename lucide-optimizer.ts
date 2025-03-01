import MagicString from "magic-string";
import { Plugin } from "vite";
import { kebabCase } from "change-case";

/**
 * @see [Vite issue](https://github.com/lucide-icons/lucide/issues/1944)
 */
export default function lucideOptimizer(): Plugin {
  return {
    name: "lucide optimizer",
    transform(code, id) {
      const ms = new MagicString(code, { filename: id });

      ms.replace(
        /([ \t]*)import\s+\{(.*?)\}\s+from\s+['"]lucide-solid['"];?/g,
        (match, whitespace: string, importNames: string) => {
          const hasSemi = match.endsWith(";");

          const imports = importNames
            .split(",")
            .map((v) => v.trim())
            .map((name) => {
              const path = kebabCase(name.replace(/Icon$/, "")).replace(/\d/, (value) => '-' + value);
              return `${whitespace}import ${name} from 'lucide-solid/icons/${path}'${hasSemi ? ";" : ""}`;
            });

          return imports.join("\n");
        },
      );

      if (ms.hasChanged()) {
        return {
          code: ms.toString(),
          map: ms.generateMap(),
        };
      }
    },
  };
}
