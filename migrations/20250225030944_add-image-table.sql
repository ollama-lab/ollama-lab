CREATE TABLE prompt_images (
    id          INTEGER NOT NULL PRIMARY KEY,
    chat_id     INTEGER NOT NULL REFERENCES chats (id) ON DELETE CASCADE ON UPDATE CASCADE,
    path        TEXT,
    image       BLOB,
    mime        TEXT 
);
