import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("education", {
  migrations: "./migrations",
});

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  videoUrl?: string;
  content: string;
  tags: string[];
  views: number;
  createdAt: Date;
}

export interface GetTutorialsResponse {
  tutorials: Tutorial[];
}

// Retrieves all educational tutorials, ordered by popularity.
export const getTutorials = api<void, GetTutorialsResponse>(
  { expose: true, method: "GET", path: "/education/tutorials" },
  async () => {
    const rows = await db.queryAll<Tutorial>`
      SELECT 
        id, title, description, category, difficulty, 
        duration, video_url as "videoUrl", content, 
        tags, views, created_at as "createdAt"
      FROM tutorials 
      ORDER BY views DESC, created_at DESC
    `;
    
    const tutorials = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags as string),
    }));
    
    return { tutorials };
  }
);
