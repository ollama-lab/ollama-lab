CREATE TABLE chat_metrics (
    chat_id                  INTEGER NOT NULL PRIMARY KEY REFERENCES chats (id) ON DELETE CASCADE ON UPDATE CASCADE,
    total_duration_nano      INTEGER,
    load_duration_nano       INTEGER,
    prompt_eval_count        INTEGER,
    prompt_eval_duration_nano INTEGER,
    eval_count               INTEGER,
    eval_duration_nano       INTEGER
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
    ct.thought_for_milli AS thought_for,
    cmt.total_duration_nano AS total_duration,
    cmt.load_duration_nano AS load_duration,
    cmt.prompt_eval_count AS prompt_eval_count,
    cmt.prompt_eval_duration_nano AS prompt_eval_duration,
    cmt.eval_count AS eval_count,
    cmt.eval_duration_nano AS eval_duration,
    ha.id AS agent_id
FROM chats c
LEFT OUTER JOIN chat_models cm ON c.id = cm.chat_id
LEFT OUTER JOIN cot_thoughts ct ON c.id = ct.chat_id
LEFT OUTER JOIN (
    SELECT chat_id, COUNT(*) AS image_count
    FROM prompt_images
    GROUP BY chat_id
) ic ON ic.chat_id = c.id
LEFT OUTER JOIN chat_metrics cmt ON c.id = cmt.chat_id
LEFT OUTER JOIN agents ha ON c.agent_id = ha.id
INNER JOIN sessions s ON c.session_id = s.id;
