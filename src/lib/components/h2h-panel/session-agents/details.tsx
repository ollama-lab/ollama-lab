import { Component, createEffect, createResource, Show, Suspense } from "solid-js";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator } from "../../ui/breadcrumb";
import { setSelectedSessionAgent } from "~/lib/contexts/globals/session-agent";
import { deleteSessionAgent, getSessionAgent, updateSessionAgent } from "~/lib/commands/agents";
import { currentSession } from "~/lib/contexts/globals/current-session";
import { createDisplayNames } from "~/lib/utils/agents";
import { Motion } from "solid-motionone";
import { LoaderSpin } from "../../loader-spin";
import { Button } from "../../ui/button";
import { TrashIcon } from "lucide-solid";
import { TextField, TextFieldInput, TextFieldLabel, TextFieldTextArea } from "../../ui/text-field";
import { reconcile } from "solid-js/store";
import { AgentUpdate } from "~/lib/models/agent";

export const AgentDetails: Component<{ agentId: number }> = (props) => {
  const agentId = () => props.agentId;

  const [agent, { mutate, refetch }] = createResource(() => [agentId(), currentSession("h2h")?.id], async ([agentId, sessionId]) => {
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

  const removeAgent = async (id: number) => {
    await deleteSessionAgent(id);
    await refetch();
  };

  const updateAgentInfo = async (id: number, value: AgentUpdate) => {
    const result = await updateSessionAgent(id, value);
    if (result) {
      mutate(reconcile(result));
    }
  };

  return (
    <Motion.div
      class="flex flex-col gap-2"
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.15 }}
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

      <div class="flex flex-col gap-2">
        <Suspense fallback={<LoaderSpin />}>
          <Show when={agent()}>
            {(item) => (
              <>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 grow">
                    <TextField
                      defaultValue={item().name}
                    >
                      <TextFieldLabel>Name</TextFieldLabel>
                      <TextFieldInput
                        onBlur={(ev) => {
                          updateAgentInfo(item().id, { name: ev.currentTarget.value });
                        }}
                      />
                    </TextField>

                    <TextField
                      defaultValue={item().model}
                    >
                      <TextFieldLabel>Model</TextFieldLabel>
                      <TextFieldInput
                        onBlur={(ev) => {
                          updateAgentInfo(item().id, { model: ev.currentTarget.value });
                        }}
                      />
                    </TextField>
                  </div>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeAgent(item().id)}
                  >
                    <TrashIcon />
                  </Button>
                </div>

                <TextField
                  defaultValue={item().systemPrompt}
                >
                  <TextFieldLabel>System prompt</TextFieldLabel>
                  <TextFieldTextArea
                    onBlur={(ev) => {
                      updateAgentInfo(item().id, { systemPrompt: ev.currentTarget.value });
                    }}
                  />
                </TextField>
              </>
            )}
          </Show>
        </Suspense>
      </div>
    </Motion.div>
  );
};
