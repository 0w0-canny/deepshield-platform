import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("education");

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  mediaType: string;
  victimProfile: string;
  attackMethod: string;
  outcome: string;
  preventionTips: string[];
  evidenceUrls: string[];
  tags: string[];
  views: number;
  createdAt: Date;
}

export interface GetCaseStudiesResponse {
  caseStudies: CaseStudy[];
}

// Retrieves real-world case studies for educational purposes.
export const getCaseStudies = api<void, GetCaseStudiesResponse>(
  { expose: true, method: "GET", path: "/education/case-studies" },
  async () => {
    const rows = await db.queryAll<CaseStudy>`
      SELECT 
        id, title, description, category, severity, media_type as "mediaType",
        victim_profile as "victimProfile", attack_method as "attackMethod",
        outcome, prevention_tips as "preventionTips", evidence_urls as "evidenceUrls",
        tags, views, created_at as "createdAt"
      FROM case_studies 
      ORDER BY severity DESC, views DESC, created_at DESC
    `;
    
    const caseStudies = rows.map(row => ({
      ...row,
      preventionTips: JSON.parse(row.preventionTips as string),
      evidenceUrls: JSON.parse(row.evidenceUrls as string),
      tags: JSON.parse(row.tags as string),
    }));
    
    return { caseStudies };
  }
);
