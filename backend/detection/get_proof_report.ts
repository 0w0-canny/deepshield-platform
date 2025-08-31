import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("detection");

export interface GetProofReportRequest {
  id: string;
}

export interface ProofReport {
  id: string;
  detectionResultId: string;
  hash: string;
  blockchainReference: string;
  createdAt: Date;
  isTamperProof: boolean;
  detectionResult: {
    id: string;
    mediaUrl: string;
    mediaType: string;
    isFake: boolean;
    confidence: number;
    identityTheftScore: number;
    analysisDetails: any;
    timestamp: Date;
  };
}

// Retrieves a tamper-proof report by ID.
export const getProofReport = api<GetProofReportRequest, ProofReport>(
  { expose: true, method: "GET", path: "/detection/reports/:id" },
  async (req) => {
    const report = await db.queryRow`
      SELECT 
        pr.id,
        pr.detection_result_id as "detectionResultId",
        pr.hash,
        pr.blockchain_reference as "blockchainReference",
        pr.created_at as "createdAt",
        pr.is_tamper_proof as "isTamperProof",
        dr.id as "result_id",
        dr.media_url as "result_mediaUrl",
        dr.media_type as "result_mediaType",
        dr.is_fake as "result_isFake",
        dr.confidence as "result_confidence",
        dr.identity_theft_score as "result_identityTheftScore",
        dr.analysis_details as "result_analysisDetails",
        dr.timestamp as "result_timestamp"
      FROM proof_reports pr
      JOIN detection_results dr ON pr.detection_result_id = dr.id
      WHERE pr.id = ${req.id}
    `;

    if (!report) {
      throw APIError.notFound("proof report not found");
    }

    return {
      id: report.id,
      detectionResultId: report.detectionResultId,
      hash: report.hash,
      blockchainReference: report.blockchainReference,
      createdAt: report.createdAt,
      isTamperProof: report.isTamperProof,
      detectionResult: {
        id: report.result_id,
        mediaUrl: report.result_mediaUrl,
        mediaType: report.result_mediaType,
        isFake: report.result_isFake,
        confidence: report.result_confidence,
        identityTheftScore: report.result_identityTheftScore,
        analysisDetails: JSON.parse(report.result_analysisDetails),
        timestamp: report.result_timestamp,
      },
    };
  }
);
