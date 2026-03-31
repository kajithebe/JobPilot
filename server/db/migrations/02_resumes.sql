CREATE TABLE IF NOT EXISTS resumes (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         VARCHAR(255) NOT NULL,
  template     VARCHAR(50) NOT NULL DEFAULT 'modern',
  theme_config JSONB NOT NULL DEFAULT '{}',
  content      JSONB NOT NULL DEFAULT '{}',
  section_order TEXT[] NOT NULL DEFAULT ARRAY['experience','education','skills','projects','certifications'],
  is_deleted   BOOLEAN DEFAULT false,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);