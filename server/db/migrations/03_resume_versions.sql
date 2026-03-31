CREATE TABLE IF NOT EXISTS resume_versions (
  id            SERIAL PRIMARY KEY,
  resume_id     INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  version_name  VARCHAR(255) NOT NULL,
  template      VARCHAR(50) NOT NULL,
  theme_config  JSONB NOT NULL DEFAULT '{}',
  content       JSONB NOT NULL DEFAULT '{}',
  section_order TEXT[] NOT NULL DEFAULT ARRAY['experience','education','skills','projects','certifications'],
  created_at    TIMESTAMP DEFAULT NOW()
);