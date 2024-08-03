-- Add migration script here

CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR(80) NOT NULL PRIMARY KEY,
    password        VARCHAR(256),
    is_default      BOOLEAN NOT NULL DEFAULT FALSE,
    date_created    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
;

INSERT INTO users (id, is_default) VALUES ('default', TRUE);

CREATE TABLE IF NOT EXISTS roles (
    name            VARCHAR(50) NOT NULL PRIMARY KEY
);

INSERT INTO roles VALUES ('user'), ('system'), ('assistant');

CREATE TABLE IF NOT EXISTS sessions (
    id              INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title           TEXT,
    owner           VARCHAR(80) NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    date_created    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bubbles (
    id              INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    session         INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    role            VARCHAR(50) NOT NULL REFERENCES roles(id) ON UPDATE CASCADE,
    content         TEXT NOT NULL,
    date_created    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_edited       BOOLEAN NOT NULL DEFAULT FALSE
);
