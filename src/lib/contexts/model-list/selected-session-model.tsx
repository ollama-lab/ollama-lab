import { Accessor, createContext, createMemo, createSignal, JSX, useContext } from "solid-js";
import { useChatSessions } from "../chats";
import { setSessionModel as setSessionModelCommand } from "~/lib/commands/sessions";
import { useChatHistory } from "../chats/chat-history";

interface SelectedSessionModelContextModel {
  selectedSessionModel: Accessor<string | null>;
  setSessionModel: (value: string) => void;
}

const SelectedSessionModelContext = createContext<SelectedSessionModelContextModel>();

export function SelectedSessionModelProvider(props: { children?: JSX.Element }) {
  const sessionContext = useChatSessions();

  const [candidate, setCandidate] = createSignal<string | null>(null);

  const sessions = createMemo(() => sessionContext?.sessions);
  const chatHistoryContext = useChatHistory();

  const selectedSessionModel = createMemo(() => {
    const s = sessions();
    const session = chatHistoryContext?.chatHistory?.session;
    if (s && s.length > 0 && session !== undefined) {
      return s?.find((s) => s.id === session)?.currentModel;
    }

    return candidate();
  });

  const setSessionModel = async (value: string) => {
    const s = sessions();
    const session = chatHistoryContext?.chatHistory?.session;

    if (s && typeof session === "number") {
      await setSessionModelCommand(session, value);
      await sessionContext?.reloadSession(session);
      setCandidate(null);
    } else {
      setCandidate(value);
    }
  };

  const selectedSessionModelFn = () => selectedSessionModel() ?? null;

  return (
    <SelectedSessionModelContext.Provider
      value={{
        selectedSessionModel: selectedSessionModelFn,
        setSessionModel,
      }}
    >
      {props.children}
    </SelectedSessionModelContext.Provider>
  );
}

export function useSelectedSessionModel() {
  return useContext(SelectedSessionModelContext);
}
