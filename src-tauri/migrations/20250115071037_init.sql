-- User profiles
CREATE TABLE profiles (
    id              INTEGER NOT NULL PRIMARY KEY,
    name            TEXT NOT NULL,
    date_created    INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Default profile
INSERT INTO profiles (id, name)
VALUES
(0, 'default');

-- Default models by profile
CREATE TABLE default_models (
    profile_id      INTEGER NOT NULL
        PRIMARY KEY
        REFERENCES profiles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    model           TEXT NOT NULL
);

CREATE TABLE system_prompts (
    profile_id      INTEGER NOT NULL
        REFERENCES profiles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    model           TEXT NOT NULL,
    prompt          TEXT NOT NULL,
    PRIMARY KEY (profile_id, model)
);

CREATE TABLE sessions (
    id              INTEGER NOT NULL PRIMARY KEY,
    profile_id      INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    title           TEXT,
    date_created    INTEGER NOT NULL DEFAULT (unixepoch()),
    current_model   TEXT NOT NULL
);

CREATE TABLE chat_roles (
    name            TEXT NOT NULL PRIMARY KEY
);

INSERT INTO chat_roles VALUES ('system'), ('user'), ('assistant'), ('tool');

-- Chat history
CREATE TABLE chats (
    id              INTEGER NOT NULL PRIMARY KEY,
    session_id      INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    role            TEXT NOT NULL DEFAULT 'user' REFERENCES chat_roles (name) ON DELETE SET DEFAULT ON UPDATE CASCADE,
    content         TEXT NOT NULL,
    completed       INTEGER NOT NULL DEFAULT 1,
    date_created    INTEGER NOT NULL DEFAULT (unixepoch()),
    date_edited     INTEGER,
    parent_id       INTEGER REFERENCES chats (id) ON DELETE CASCADE ON UPDATE CASCADE,
    priority        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE chat_models (
    chat_id         INTEGER NOT NULL PRIMARY KEY REFERENCES chats (id) ON DELETE CASCADE ON UPDATE CASCADE,
    model           TEXT NOT NULL
);

-- Thoughts (Chain-of-thoughts feature)
CREATE TABLE cot_thoughts (
    chat_id             INTEGER NOT NULL PRIMARY KEY REFERENCES chats (id) ON DELETE CASCADE ON UPDATE CASCADE,
    content             TEXT NOT NULL,
    thought_for_milli   INTEGER
);

CREATE VIEW v_complete_chats
AS
SELECT
    c.id AS id,
    c.session_id AS session_id,
    c.role AS role,
    c.content AS content,
    c.completed AS completed,
    c.date_created AS date_created,
    c.date_edited AS date_edited,
    c.parent_id AS parent_id,
    c.priority AS priority,
    cm.model AS model,
    ct.content AS thoughts,
    ct.thought_for_milli AS thought_for
FROM chats c
LEFT OUTER JOIN chat_models cm ON c.id = cm.chat_id
LEFT OUTER JOIN cot_thoughts ct ON c.id = ct.chat_id;
