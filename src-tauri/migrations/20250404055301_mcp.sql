CREATE TABLE mcp_transport_types (
    name        TEXT NOT NULL PRIMARY KEY
);

INSERT INTO mcp_transport_types (name)
VALUES
('stdio'), ('sse');

CREATE TABLE mcp_sources (
    id              INTEGER NOT NULL PRIMARY KEY,
    label           TEXT,
    source          TEXT NOT NULL,
    transport_type  TEXT NOT NULL REFERENCES mcp_transport_types (name) ON UPDATE CASCADE,
    session_id      INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    date_created    INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE default_mcp (
    id              INTEGER NOT NULL PRIMARY KEY,
    label           TEXT,
    source          TEXT NOT NULL,
    transport_type  TEXT NOT NULL REFERENCES mcp_transport_types (name) ON UPDATE CASCADE,
    profile_id      INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE chats_tool_calls (
    id              INTEGER NOT NULL PRIMARY KEY,
    name            TEXT NOT NULL,
    chat_id         INTEGER NOT NULL REFERENCES chats (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE chats_tool_calls_args (
    id              INTEGER NOT NULL PRIMARY KEY,
    name            TEXT NOT NULL,
    value_json      TEXT NOT NULL,
    tool_call_id    INTEGER NOT NULL REFERENCES chats_tool_calls (id) ON DELETE CASCADE ON UPDATE CASCADE
);
