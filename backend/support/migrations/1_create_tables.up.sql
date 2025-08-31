CREATE TABLE victim_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  contact_info TEXT,
  website TEXT,
  availability TEXT,
  cost TEXT NOT NULL,
  tags JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_victim_resources_category ON victim_resources(category);
CREATE INDEX idx_victim_resources_type ON victim_resources(resource_type);
