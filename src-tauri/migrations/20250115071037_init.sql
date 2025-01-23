CREATE TABLE profiles (
    id              INTEGER NOT NULL PRIMARY KEY,
    name            TEXT NOT NULL,
    date_created    INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO profiles (id, name)
VALUES
(0, 'default');

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

CREATE TABLE prompt_roles (
    name            TEXT NOT NULL PRIMARY KEY
);

INSERT INTO prompt_roles VALUES ('system'), ('user'), ('assistant'), ('tool');

CREATE TABLE historial_prompts (
    id              INTEGER NOT NULL PRIMARY KEY,
    session_id      INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    role            TEXT NOT NULL DEFAULT 'system' REFERENCES prompt_roles (name) ON DELETE SET DEFAULT ON UPDATE CASCADE,
    content         TEXT NOT NULL,
    date_created    INTEGER NOT NULL DEFAULT (unixepoch()),
    date_edited     INTEGER,
    model           TEXT
);
