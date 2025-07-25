import { Component, createMemo, createResource, Suspense } from "solid-js";
import { TextField, TextFieldLabel, TextFieldTextArea } from "../../ui/text-field";
import { currentSession } from "~/lib/contexts/globals/current-session";
import { getSessionSystemPrompt, setSessionSystemPrompt } from "~/lib/commands/system-prompts";
import { useSessionMode } from "~/lib/contexts/session-mode";
import { newSession } from "~/lib/contexts/globals/sessions";

const SessionSettings: Component = () => {
  const mode = useSessionMode();

  const currentH2hSession = createMemo(() => currentSession(mode()));

  const [systemPrompt, { refetch }] = createResource(() => [currentH2hSession()], async ([session]) => {
    if (!session) {
      return undefined;
    }
    return await getSessionSystemPrompt(session.id);
  });

  const updateSystemPrompt = async (content: string) => {
    let id = currentH2hSession()?.id;
    if (id === undefined) {
      const session = await newSession(mode(), "", "New Chat");
      id = session.id;
    }

    await setSessionSystemPrompt(id, content);
    await refetch();
  };

  return (
    <Suspense>
      <div class="flex flex-col gap-2">
        <TextField>
          <TextFieldLabel>System prompt</TextFieldLabel>
          <TextFieldTextArea
            value={systemPrompt() ?? ""}
            onBlur={(ev) => {
              updateSystemPrompt(ev.currentTarget.value);
            }}
          />
        </TextField>
      </div>
    </Suspense>
  );
};

export default SessionSettings;
