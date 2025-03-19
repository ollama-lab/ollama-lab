import { Component, createResource, Show, Suspense } from "solid-js";
import { getAgentTemplate } from "~/lib/commands/agent-templates";
import { selectedAgentTemplate } from "~/lib/contexts/globals/agents";
import { LoadingScreen } from "../custom-ui/loading-screen";
import { PlaceholderPage } from "../model-page/placeholder-title";
import { createDisplayNames } from "~/lib/utils/agents";

export const AgentTemplateDetails: Component = () => {
  const [details] = createResource(selectedAgentTemplate, async (id) => {
    return (await getAgentTemplate(id)) ?? undefined
  });

  const names = createDisplayNames(() => details());

  return (
    <Show when={selectedAgentTemplate() !== undefined} fallback={<PlaceholderPage />}>
      <Suspense fallback={<LoadingScreen />}>
        <div class="flex flex-col px-2 py-2 md:px-4 md:py-4">
          <span>{names().displayName}</span>
          <span>{names().displayModel}</span>
        </div>
      </Suspense>
    </Show>
  );
};
