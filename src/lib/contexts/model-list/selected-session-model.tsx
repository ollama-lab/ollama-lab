import { Accessor, createContext, createMemo, createSignal, JSX, useContext } from "solid-js";
import { useChatSessions } from "../chats";
import { useChatHistory } from "../chats/chat-history";
import { setSessionModel as setSessionModelCommand } from "~/lib/commands/sessions";

interface SelectedSessionModelContextModel {
  selectedSessionModel: Accessor<string | null>;
  setSessionModel: (value: string) => void;
}

const SelectedSessionModelContext = createContext<SelectedSessionModelContextModel>();

export function SelectedSessionModelProvider(props: { children?: JSX.Element }) {
  const sessionContext = useChatSessions();
  const chatHistoryContext = useChatHistory();

  const [candidate, setCandidate] = createSignal<string | null>(null);

  const sessions = createMemo(() => sessionContext?.sessions);
  const chatHistory = createMemo(() => chatHistoryContext?.chatHistory);

  const selectedSessionModel = createMemo(() => {
    const s = sessions();
    const ch = chatHistory();
    if (s && s.length > 0 && ch?.session !== undefined) {
      return s?.find(s => s.id === ch?.session)?.currentModel;
    }

    return candidate();
  });

  const setSessionModel = async (value: string) => {
    const s = sessions();
    const ch = chatHistory();

    if (s && ch) {
      await setSessionModelCommand(ch.session, value); 
      await sessionContext?.reloadSession(ch.session);
      setCandidate(null);
    } else {
      setCandidate(value);
    }
  };

  const selectedSessionModelFn = () => selectedSessionModel() ?? null;

  return (
    <SelectedSessionModelContext.Provider value={{
      selectedSessionModel: selectedSessionModelFn,
      setSessionModel,
    }}>
      {props.children}
    </SelectedSessionModelContext.Provider>
  );
}

export function useSelectedSessionModel() {
  return useContext(SelectedSessionModelContext);
}
