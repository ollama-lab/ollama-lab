CREATE TABLE prompt_images (
    id          INTEGER NOT NULL PRIMARY KEY,
    chat_id     INTEGER NOT NULL REFERENCES chats (id) ON DELETE CASCADE ON UPDATE CASCADE,
    origin      TEXT,
    path        TEXT NOT NULL
);

DROP VIEW IF EXISTS v_complete_chats;
CREATE VIEW v_complete_chats
AS
SELECT
    c.id AS id,
    c.session_id AS session_id,
    c.role AS role,
    c.content AS content,
    ic.image_count AS image_count,
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
LEFT OUTER JOIN cot_thoughts ct ON c.id = ct.chat_id
LEFT OUTER JOIN (
    SELECT chat_id, COUNT(*) AS image_count
    FROM prompt_images
    GROUP BY chat_id
) ic ON ic.chat_id = c.id;
