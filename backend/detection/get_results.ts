import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("detection");

export interface GetResultsResponse {
  results: DetectionResult[];
}

interface DetectionResult {
  id: string;
  mediaUrl: string;
  mediaType: string;
  isFake: boolean;
  confidence: number;
  identityTheftScore: number;
  analysisDetails: any;
  timestamp: Date;
}

// Retrieves all detection results, ordered by timestamp (latest first).
export const getResults = api<void, GetResultsResponse>(
  { expose: true, method: "GET", path: "/detection/results" },
  async () => {
    const rows = await db.queryAll<DetectionResult>`
      SELECT 
        id, media_url as "mediaUrl", media_type as "mediaType", 
        is_fake as "isFake", confidence, identity_theft_score as "identityTheftScore",
        analysis_details as "analysisDetails", timestamp
      FROM detection_results 
      ORDER BY timestamp DESC
    `;
    
    const results = rows.map(row => ({
      ...row,
      analysisDetails: JSON.parse(row.analysisDetails as string),
    }));
    
    return { results };
  }
);
