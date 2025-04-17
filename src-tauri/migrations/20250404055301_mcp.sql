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
    profile_id      INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    date_created    INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE session_enabled_mcp_sources (
    session_id      INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    mcp_source_id   INTEGER NOT NULL REFERENCES mcp_sources (id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (session_id, mcp_source_id)
);

ALTER TABLE chats
ADD COLUMN tool_call_json TEXT;
