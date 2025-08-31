import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("support", {
  migrations: "./migrations",
});

export interface VictimResource {
  id: string;
  title: string;
  description: string;
  category: "legal" | "psychological" | "technical" | "financial";
  resourceType: "hotline" | "website" | "organization" | "guide";
  contactInfo?: string;
  website?: string;
  availability?: string;
  cost: "free" | "paid" | "sliding-scale";
  tags: string[];
}

export interface GetVictimResourcesResponse {
  resources: VictimResource[];
}

// Retrieves support resources for deepfake victims.
export const getVictimResources = api<void, GetVictimResourcesResponse>(
  { expose: true, method: "GET", path: "/support/victim-resources" },
  async () => {
    const rows = await db.queryAll<VictimResource>`
      SELECT 
        id, title, description, category, resource_type as "resourceType",
        contact_info as "contactInfo", website, availability, cost, tags
      FROM victim_resources 
      ORDER BY category, title
    `;
    
    const resources = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags as string),
    }));
    
    return { resources };
  }
);
