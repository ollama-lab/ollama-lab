CREATE TABLE prompt_image_paths (
    id          INTEGER NOT NULL PRIMARY KEY,
    chat_id     INTEGER NOT NULL REFERENCES chats (id) ON DELETE CASCADE ON UPDATE CASCADE,
    image_path  TEXT NOT NULL
);
