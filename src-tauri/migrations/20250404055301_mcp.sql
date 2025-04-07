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
