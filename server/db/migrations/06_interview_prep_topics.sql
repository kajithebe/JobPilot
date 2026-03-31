CREATE TABLE IF NOT EXISTS interview_prep_topics (
  id            SERIAL PRIMARY KEY,
  interview_id  INTEGER NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic         VARCHAR(255) NOT NULL,
  is_completed  BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW()
);