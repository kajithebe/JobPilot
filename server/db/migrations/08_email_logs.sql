CREATE TABLE IF NOT EXISTS email_logs (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interview_id  INTEGER REFERENCES interviews(id) ON DELETE SET NULL,
  email_type    VARCHAR(50) NOT NULL,
  recipient     VARCHAR(255) NOT NULL,
  status        VARCHAR(50) NOT NULL DEFAULT 'sent',
  error_message TEXT,
  sent_at       TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_email_type CHECK (
    email_type IN ('interview_reminder','checkin_followup')
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('sent','failed')
  )
);