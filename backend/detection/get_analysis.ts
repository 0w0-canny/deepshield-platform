import { api, APIError } from "encore.dev/api";

export interface GetAnalysisRequest {
  analysisId: string;
}

export interface GetAnalysisResponse {
  analysisId: string;
  status: "pending" | "completed" | "failed";
  result?: {
    isAuthentic: boolean;
    confidenceScore: number;
    identityTheftRisk: "low" | "medium" | "high" | "critical";
    detectionDetails: {
      technicalMarkers: string[];
      suspiciousPatterns: string[];
      metadataAnalysis: string[];
    };
    timestamp: Date;
  };
  createdAt: Date;
}

// Retrieves the analysis results for a specific analysis ID.
export const getAnalysis = api<GetAnalysisRequest, GetAnalysisResponse>(
  { expose: true, method: "GET", path: "/analysis/:analysisId" },
  async (req) => {
    // Mock data - in real implementation, this would fetch from database
    if (!req.analysisId.startsWith("analysis_")) {
      throw APIError.notFound("Analysis not found");
    }

    return {
      analysisId: req.analysisId,
      status: "completed",
      result: {
        isAuthentic: Math.random() > 0.3,
        confidenceScore: Math.round(Math.random() * 100 * 100) / 100,
        identityTheftRisk: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
        detectionDetails: {
          technicalMarkers: [
            "Facial landmark inconsistencies detected",
            "Temporal artifacts in frame transitions"
          ],
          suspiciousPatterns: [
            "Inconsistent lighting across facial features",
            "Audio-visual synchronization issues"
          ],
          metadataAnalysis: [
            "File creation timestamp matches claimed origin",
            "Original camera sensor fingerprint intact"
          ]
        },
        timestamp: new Date()
      },
      createdAt: new Date(Date.now() - Math.random() * 86400000)
    };
  }
);
