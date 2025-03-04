import { Accessor, createContext, createResource, createSignal, JSX, Resource, Setter, useContext } from "solid-js";
import { searchModel } from "../utils/search/model-search";
import { toast } from "solid-sonner";
import { modelList, reloadModelStates } from "./globals/model-states";
import { addPullTask, getTaskMap, errorPullTask, setTaskMap, clearPullTasks } from "./globals/pull-model-tasks";
import { pullModel } from "../commands/models";
import { setCurrentModelPageModel } from "./globals/model-page";

export const BASE_DOMAIN = "ollama.com";
export const BASE_URL = `https://${BASE_DOMAIN}`;

export type TagType = "category" | "parameter";

export interface Tag {
  type: TagType;
  content: string;
}

export interface SearchItem {
  name: string;
  description?: string;
  tags: Tag[];
  pulls: string;
  tagCount: string;
  updated: string;
}

export type Category = "all" | "embedding" | "vision" | "tools";

export type OrderedBy = "popular" | "newest";

export interface SearchResult {
  keyword: string;
  category: Category;
  orderedBy: OrderedBy;
  result: SearchItem[];
}

export type ModelPullingInitiator = (model: string) => Promise<void>;

export interface ModelSearchReusltContextModel {
  keyword: Accessor<string>;
  searchResult: Resource<SearchResult | null>;
  initiateSearch: (keyword: string) => void;
  mutate: Setter<SearchResult | null | undefined>;
  startPullModel: ModelPullingInitiator;
}

const ModelSearchResultContext = createContext<ModelSearchReusltContextModel>();

function trimKeyword(keyword: string | null) {
  if (!keyword) {
    return "";
  }

  const trimmedKeyword = keyword.trim();
  if (trimmedKeyword.length < 1) {
    return "";
  }

  return trimmedKeyword;
}

async function fetcher(keyword: string): Promise<SearchResult | null> {
  if (keyword.length < 1) {
    return null;
  }

  const result = Array.from(await searchModel(keyword));
  return { category: "all", orderedBy: "popular", keyword, result };
}

export function ModelSearchResultProvider(props: { children?: JSX.Element }) {
  const [keyword, setKeyword] = createSignal<string | null>(null);
  const [searchResult, { mutate, refetch }] = createResource(keyword, fetcher);

  const initiateSearch = (newKeyword: string) => {
    const trimmedKeyword = trimKeyword(newKeyword);
    if (keyword() === trimmedKeyword) {
      refetch();
      return;
    }

    setKeyword(trimmedKeyword);
  };

  const startPullModel: ModelPullingInitiator = async (model) => {
    const downloadedAlready = modelList().filter(({ name }) => name === model).length > 0;
    if (downloadedAlready) {
      toast.error("Model already downloaded");
      return;
    }

    const taskMap = getTaskMap();
    const downloading = Object.keys(taskMap).includes(model);
    if (downloading) {
      toast.warning("Model already downloading");
      return;
    }

    addPullTask(model, "Starting pulling...");

    try {
      await pullModel(model, (ev) => {
        if (ev.type === "success") {
          clearPullTasks(model);
          reloadModelStates();
          setCurrentModelPageModel(model);
          return;
        }
        setTaskMap(model, ev);
      });
    } catch (err) {
      errorPullTask(model, `Error: ${err}`);
    }
  };

  return (
    <ModelSearchResultContext.Provider
      value={{
        keyword: () => keyword() ?? "",
        searchResult,
        initiateSearch,
        mutate,
        startPullModel,
      }}
    >
      {props.children}
    </ModelSearchResultContext.Provider>
  );
}

export function useModelSearchResult() {
  return useContext(ModelSearchResultContext);
}
