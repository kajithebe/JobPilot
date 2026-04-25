import cron from 'node-cron';
import pool from '../db/pool.js';

export const startInterviewCron = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      await pool.query(
        `SELECT i.id FROM interviews i
         WHERE i.checked_in = false
           AND i.scheduled_at < NOW()`
      );
    } catch (err) {
      console.error('[InterviewCron] Error:', err.message);
    }
  });
};
