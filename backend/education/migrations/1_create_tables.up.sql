CREATE TABLE tutorials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration INTEGER NOT NULL,
  video_url TEXT,
  content TEXT NOT NULL,
  tags JSONB NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE case_studies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  media_type TEXT NOT NULL,
  victim_profile TEXT NOT NULL,
  attack_method TEXT NOT NULL,
  outcome TEXT NOT NULL,
  prevention_tips JSONB NOT NULL,
  evidence_urls JSONB NOT NULL,
  tags JSONB NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tutorials_views ON tutorials(views DESC);
CREATE INDEX idx_tutorials_category ON tutorials(category);
CREATE INDEX idx_case_studies_severity ON case_studies(severity DESC);
CREATE INDEX idx_case_studies_category ON case_studies(category);
