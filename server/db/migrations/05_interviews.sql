CREATE TABLE IF NOT EXISTS interviews (
  id                SERIAL PRIMARY KEY,
  application_id    INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interview_type    VARCHAR(50) NOT NULL DEFAULT 'online',
  scheduled_at      TIMESTAMP NOT NULL,
  location          VARCHAR(500),
  notes             TEXT,
  outcome           VARCHAR(50),
  checked_in        BOOLEAN DEFAULT false,
  reminder_sent     BOOLEAN DEFAULT false,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_interview_type CHECK (
    interview_type IN ('online','on-site','phone','technical','hr')
  ),
  CONSTRAINT valid_outcome CHECK (
    outcome IN ('offer','rejected','waiting') OR outcome IS NULL
  )
);