ALTER TABLE sessions
ADD COLUMN is_h2h INTEGER NOT NULL DEFAULT FALSE;

CREATE TABLE h2h_agents (
    id              INTEGER NOT NULL PRIMARY KEY,
    name            TEXT,
    model           TEXT NOT NULL,
    system_prompt   TEXT,
    date_created    INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE h2h_session_system_prompts (
    id              INTEGER NOT NULL PRIMARY KEY,
    session_id      INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    content         TEXT NOT NULL,
    date_created    INTEGER NOT NULL DEFAULT (unixepoch())
);

ALTER TABLE chats
ADD COLUMN h2h_agent_id INTEGER REFERENCES h2h_agents (id) ON DELETE CASCADE ON UPDATE CASCADE;
