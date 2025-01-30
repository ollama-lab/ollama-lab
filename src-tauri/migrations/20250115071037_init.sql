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
    model           TEXT,
    parent_id       INTEGER REFERENCES chats (id) ON DELETE CASCADE ON UPDATE CASCADE,
    priority        INTEGER NOT NULL DEFAULT 0
);

-- Thoughts (Chain-of-thoughts feature)
CREATE TABLE cot_thoughts (
    chat_id             INTEGER NOT NULL PRIMARY KEY REFERENCES chats (id) ON DELETE CASCADE ON UPDATE CASCADE,
    content             TEXT NOT NULL,
    thought_for_milli   INTEGER
);
