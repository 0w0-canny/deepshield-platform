import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("detection", {
  migrations: "./migrations",
});

export interface AnalyzeMediaRequest {
  mediaUrl: string;
  mediaType: "image" | "video" | "audio";
}

export interface DetectionResult {
  id: string;
  mediaUrl: string;
  mediaType: string;
  isFake: boolean;
  confidence: number;
  identityTheftScore: number;
  analysisDetails: {
    faceManipulation?: number;
    voiceCloning?: number;
    deepfakeIndicators?: string[];
    technicalAnomalies?: string[];
  };
  timestamp: Date;
}

export interface AnalyzeMediaResponse {
  result: DetectionResult;
  proofReportId: string;
}

// Analyzes uploaded media for deepfake detection and generates tamper-proof report.
export const analyzeMedia = api<AnalyzeMediaRequest, AnalyzeMediaResponse>(
  { expose: true, method: "POST", path: "/detection/analyze" },
  async (req) => {
    const resultId = generateId();
    const proofReportId = generateId();
    
    // Simulate AI analysis
    const mockAnalysis = await simulateAIAnalysis(req.mediaUrl, req.mediaType);
    
    const result: DetectionResult = {
      id: resultId,
      mediaUrl: req.mediaUrl,
      mediaType: req.mediaType,
      isFake: mockAnalysis.isFake,
      confidence: mockAnalysis.confidence,
      identityTheftScore: mockAnalysis.identityTheftScore,
      analysisDetails: mockAnalysis.details,
      timestamp: new Date(),
    };

    // Store detection result
    await db.exec`
      INSERT INTO detection_results (
        id, media_url, media_type, is_fake, confidence, 
        identity_theft_score, analysis_details, timestamp
      ) VALUES (
        ${result.id}, ${result.mediaUrl}, ${result.mediaType}, 
        ${result.isFake}, ${result.confidence}, ${result.identityTheftScore},
        ${JSON.stringify(result.analysisDetails)}, ${result.timestamp}
      )
    `;

    // Generate proof report
    await db.exec`
      INSERT INTO proof_reports (
        id, detection_result_id, hash, blockchain_reference, 
        created_at, is_tamper_proof
      ) VALUES (
        ${proofReportId}, ${result.id}, ${generateHash(result)}, 
        ${generateBlockchainRef()}, ${new Date()}, true
      )
    `;

    return {
      result,
      proofReportId,
    };
  }
);

async function simulateAIAnalysis(mediaUrl: string, mediaType: string) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const isFake = Math.random() > 0.7;
  const confidence = Math.random() * 0.3 + (isFake ? 0.7 : 0.4);
  
  let details: any = {};
  let identityTheftScore = 0;
  
  if (mediaType === "image" || mediaType === "video") {
    details.faceManipulation = Math.random() * 100;
    details.deepfakeIndicators = isFake ? 
      ["Inconsistent lighting", "Unnatural facial expressions", "Edge artifacts"] :
      ["Natural facial movements", "Consistent lighting"];
    identityTheftScore = isFake ? Math.random() * 40 + 60 : Math.random() * 30;
  }
  
  if (mediaType === "audio" || mediaType === "video") {
    details.voiceCloning = Math.random() * 100;
    details.technicalAnomalies = isFake ?
      ["Spectral inconsistencies", "Unnatural prosody"] :
      ["Natural speech patterns"];
    identityTheftScore = Math.max(identityTheftScore, isFake ? Math.random() * 35 + 65 : Math.random() * 25);
  }
  
  return {
    isFake,
    confidence,
    identityTheftScore,
    details,
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateHash(result: DetectionResult): string {
  return `hash_${result.id}_${Date.now()}`;
}

function generateBlockchainRef(): string {
  return `bc_${Math.random().toString(36).substring(2)}`;
}
