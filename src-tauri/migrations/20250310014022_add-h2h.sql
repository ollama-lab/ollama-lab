ALTER TABLE sessions
ADD COLUMN is_h2h INTEGER NOT NULL DEFAULT FALSE;

CREATE TABLE agents (
    id              INTEGER NOT NULL PRIMARY KEY,
    name            TEXT,
    model           TEXT NOT NULL,
    system_prompt   TEXT,
    profile_id      INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    date_created    INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE session_system_prompts (
    session_id      INTEGER NOT NULL PRIMARY KEY REFERENCES sessions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    content         TEXT NOT NULL
);

ALTER TABLE chats
ADD COLUMN agent_id INTEGER REFERENCES agents (id) ON DELETE CASCADE ON UPDATE CASCADE;

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
    ha.id AS agent_id
FROM chats c
LEFT OUTER JOIN chat_models cm ON c.id = cm.chat_id
LEFT OUTER JOIN cot_thoughts ct ON c.id = ct.chat_id
LEFT OUTER JOIN (
    SELECT chat_id, COUNT(*) AS image_count
    FROM prompt_images
    GROUP BY chat_id
) ic ON ic.chat_id = c.id
LEFT OUTER JOIN agents ha ON c.agent_id = ha.id
INNER JOIN sessions s ON c.session_id = s.id;

CREATE TABLE selected_agents (
    session_id      INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    agent_id        INTEGER NOT NULL REFERENCES agents (id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (session_id, agent_id)
);
