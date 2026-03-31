CREATE TABLE IF NOT EXISTS applications (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resume_version_id   INTEGER REFERENCES resume_versions(id) ON DELETE SET NULL,
  company             VARCHAR(255) NOT NULL,
  role                VARCHAR(255) NOT NULL,
  job_url             VARCHAR(500),
  location            VARCHAR(255),
  salary              VARCHAR(100),
  status              VARCHAR(50) NOT NULL DEFAULT 'wishlist',
  notes               TEXT,
  applied_at          TIMESTAMP,
  is_deleted          BOOLEAN DEFAULT false,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (
    status IN ('wishlist','applied','interview','offer','rejected','withdrawn')
  )
);