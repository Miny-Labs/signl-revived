import Database from 'better-sqlite3';
import { RecurringJob } from '../types';
import { v4 as uuidv4 } from 'uuid';

const db = new Database('signl.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    userEmail TEXT NOT NULL,
    templateId TEXT NOT NULL,
    targetName TEXT NOT NULL,
    targetUrl TEXT NOT NULL,
    customQuery TEXT,
    frequency TEXT NOT NULL,
    lastRunAt TEXT,
    nextRunAt TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    lastResultHash TEXT
  )
`);

export const JobManager = {
  createJob: (job: Omit<RecurringJob, 'id' | 'lastRunAt' | 'nextRunAt' | 'isActive'>) => {
    const id = uuidv4();
    const nextRunAt = new Date().toISOString(); 
    const stmt = db.prepare(`
      INSERT INTO jobs (
        id, userId, userEmail, templateId, targetName, targetUrl, 
        customQuery, frequency, nextRunAt, isActive
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    stmt.run(
      id, job.userId, job.userEmail, job.templateId, job.targetName, 
      job.targetUrl, job.customQuery || null, job.frequency, nextRunAt
    );
    return id;
  },

  getDueJobs: (): RecurringJob[] => {
    const now = new Date().toISOString();
    const results = db.prepare('SELECT * FROM jobs WHERE isActive = 1 AND nextRunAt <= ?').all(now);
    return results.map((row: any) => ({ ...row, isActive: row.isActive === 1 }));
  },

  updateJobAfterRun: (id: string, nextRunDate: Date, resultHash?: string) => {
    const now = new Date().toISOString();
    const next = nextRunDate.toISOString();
    if (resultHash) {
      db.prepare('UPDATE jobs SET lastRunAt = ?, nextRunAt = ?, lastResultHash = ? WHERE id = ?')
        .run(now, next, resultHash, id);
    } else {
      db.prepare('UPDATE jobs SET lastRunAt = ?, nextRunAt = ? WHERE id = ?')
        .run(now, next, id);
    }
  },

  listUserJobs: (userId: string): RecurringJob[] => {
    const results = db.prepare('SELECT * FROM jobs WHERE userId = ?').all(userId);
    return results.map((row: any) => ({ ...row, isActive: row.isActive === 1 }));
  },

  deleteJob: (id: string, userId: string) => {
    db.prepare('DELETE FROM jobs WHERE id = ? AND userId = ?').run(id, userId);
  },

  toggleJobStatus: (id: string, userId: string, isActive: boolean) => {
    db.prepare('UPDATE jobs SET isActive = ? WHERE id = ? AND userId = ?')
      .run(isActive ? 1 : 0, id, userId);
  }
};