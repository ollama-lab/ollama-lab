-- Your SQL goes here

CREATE TABLE users (
    id              VARCHAR(80) PRIMARY KEY,
    password        VARCHAR(256),
    is_default      BOOLEAN NOT NULL DEFAULT FALSE,
    date_created    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, is_default) VALUES ('local', TRUE);

CREATE TABLE roles (
    name            VARCHAR(50) PRIMARY KEY
);

INSERT INTO roles VALUES ('user'), ('system'), ('assistant');

CREATE TABLE sessions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT,
    owner           VARCHAR(80) NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    date_created    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bubbles (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    session         INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    role            VARCHAR(50) NOT NULL REFERENCES roles(id) ON UPDATE CASCADE,
    content         TEXT NOT NULL,
    date_created    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_edited       BOOLEAN NOT NULL DEFAULT FALSE
);
