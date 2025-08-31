CREATE TABLE detection_results (
  id TEXT PRIMARY KEY,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  is_fake BOOLEAN NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  identity_theft_score DOUBLE PRECISION NOT NULL,
  analysis_details JSONB NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE proof_reports (
  id TEXT PRIMARY KEY,
  detection_result_id TEXT NOT NULL REFERENCES detection_results(id),
  hash TEXT NOT NULL,
  blockchain_reference TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_tamper_proof BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_detection_results_timestamp ON detection_results(timestamp DESC);
CREATE INDEX idx_proof_reports_detection_result_id ON proof_reports(detection_result_id);
