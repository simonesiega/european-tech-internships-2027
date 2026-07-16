import {DatabaseSync} from "node:sqlite";
import type {Internship} from "@/types/internship";

const LAST_UPDATED_QUERY = `
  SELECT MAX(last_seen_at) AS lastUpdatedAt
  FROM jobs
  WHERE status = 'open'
`;

const OPEN_INTERNSHIPS_QUERY = `
  SELECT
    linkedin_job_id AS linkedinJobId,
    company,
    title,
    location,
    link,
    category,
    work_mode AS workMode,
    start_date AS startDate,
    first_seen_at AS firstSeenAt
  FROM jobs
  WHERE status = 'open'
  ORDER BY lower(company), lower(title), location
`;

export function getDirectoryLastUpdatedAt(): string | null {
  const databasePath = process.env.INTERNSHIPS_DATABASE_PATH ?? "../data/internships.db";
  const database = new DatabaseSync(databasePath, {readOnly: true});

  try {
    const row = database.prepare(LAST_UPDATED_QUERY).get() as {
      lastUpdatedAt: string | null;
    };
    return row.lastUpdatedAt;
  } finally {
    database.close();
  }
}

export function getOpenInternships(): Internship[] {
  const databasePath = process.env.INTERNSHIPS_DATABASE_PATH ?? "../data/internships.db";
  const database = new DatabaseSync(databasePath, {readOnly: true});

  try {
    // Open a short-lived read-only connection so each request observes the latest
    // committed collection without sharing mutable SQLite state between requests.
    const rows = database.prepare(OPEN_INTERNSHIPS_QUERY).all() as Internship[];

    // node:sqlite returns rows with a null prototype. Rebuild each record as a
    // plain object before crossing the Server Component boundary.
    return rows.map(
      ({
        linkedinJobId,
        company,
        title,
        location,
        link,
        category,
        workMode,
        startDate,
        firstSeenAt,
      }) => ({
        linkedinJobId,
        company,
        title,
        location,
        link,
        category,
        workMode,
        startDate,
        firstSeenAt,
      })
    );
  } finally {
    database.close();
  }
}
