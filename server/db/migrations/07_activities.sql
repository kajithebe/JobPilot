CREATE TABLE IF NOT EXISTS activities (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type   VARCHAR(50) NOT NULL,
  entity_id     INTEGER NOT NULL,
  action        VARCHAR(100) NOT NULL,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_entity_type CHECK (
    entity_type IN ('resume','application','interview','version')
  )
);