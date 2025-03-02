import { createContext, JSX, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { getSession, listSessions } from "~/lib/commands/sessions";
import { Session } from "~/lib/models/session";

interface ChatContextModel {
  sessions: Session[];
  reload: () => Promise<void>;
  reloadSession: (id: number) => Promise<void>;
}

const ChatSessionsContext = createContext<ChatContextModel>({
  sessions: [],
  reload: async () => {},
  reloadSession: async () => {},
});

export function ChatSessionsProvider(props: { children?: JSX.Element }) {
  const [sessions, setSessions] = createStore<Session[]>([]);

  const reload = async () => {
    setSessions(await listSessions());
  };

  const reloadSession = async (id: number) => {
    const session = await getSession(id);
    if (!session) {
      return;
    }

    setSessions(
      produce((cur) => {
        const index = cur.findIndex((value) => value.id === id);
        if (index < 0) {
          cur.unshift(session);
          return;
        }

        cur[index] = session;
      }),
    );
  };

  return (
    <ChatSessionsContext.Provider
      value={{
        sessions,
        reload,
        reloadSession,
      }}
    >
      {props.children}
    </ChatSessionsContext.Provider>
  );
}

export function useChatSessions() {
  return useContext(ChatSessionsContext);
}
