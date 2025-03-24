import { Component, createEffect, createResource, Show, Suspense } from "solid-js";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator } from "../../ui/breadcrumb";
import { setSelectedSessionAgent } from "~/lib/contexts/globals/session-agent";
import { getSessionAgent } from "~/lib/commands/agents";
import { currentSession } from "~/lib/contexts/globals/current-session";
import { createDisplayNames } from "~/lib/utils/agents";
import { Motion } from "solid-motionone";
import AgentNameGroup from "../../custom-ui/agent-name-group";
import { LoaderSpin } from "../../loader-spin";

export const AgentDetails: Component<{ agentId: number }> = (props) => {
  const agentId = () => props.agentId;

  const [agent] = createResource(() => [agentId(), currentSession()?.id], async ([agentId, sessionId]) => {
    if (agentId === undefined || sessionId === undefined) {
      return undefined;
    }

    return await getSessionAgent(agentId, sessionId);
  });

  const displayNames = createDisplayNames(() => agent());

  createEffect(() => {
    if (!agent()) {
      setSelectedSessionAgent(undefined);
    }
  });

  return (
    <Motion.div
      class="flex flex-col gap-2"
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      exit={{ x: "100%" }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => setSelectedSessionAgent(undefined)} class="cursor-pointer">
              Session agents
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink current>
              {displayNames().displayName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Suspense fallback={<LoaderSpin />}>
        <Show when={agent()}>
          {(model) => (
            <div class="flex items-center gap-2">
              <AgentNameGroup item={model()} />
            </div>
          )}
        </Show>
      </Suspense>
    </Motion.div>
  );
};
