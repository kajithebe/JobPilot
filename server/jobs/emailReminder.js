import nodemailer from 'nodemailer';
import cron from 'node-cron';
import pool from '../db/pool.js';
import {interviewReminderTemplate} from '../utils/emailTemplates.js';

// ── Transporter ───────────────────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// ── Send reminder email ───────────────────────────────────────────────
const sendReminderEmail = async (interview) => {
  const transporter = createTransporter();
  const {subject, html} = interviewReminderTemplate({
    candidateName: interview.user_name,
    company: interview.company,
    role: interview.role,
    interviewType: interview.interview_type,
    scheduledAt: interview.scheduled_at,
    location: interview.location,
  });

  await transporter.sendMail({
    from: `"JobPilot" <${process.env.SMTP_USER}>`,
    to: interview.user_email,
    subject,
    html,
  });
};

// ── Log email to DB ───────────────────────────────────────────────────
const logEmail = async (interview, status, errorMessage = null) => {
  await pool.query(
    `INSERT INTO email_logs
       (user_id, interview_id, email_type, recipient, status, error_message)
     VALUES ($1, $2, 'interview_reminder', $3, $4, $5)`,
    [
      interview.user_id,
      interview.id,
      interview.user_email,
      status,
      errorMessage,
    ]
  );
};

// ── Main cron job — runs every hour ──────────────────────────────────
export const startEmailReminderCron = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      // Find interviews in the next 24-25 hour window not yet reminded
      const result = await pool.query(
        `SELECT
           i.id, i.user_id, i.application_id, i.interview_type,
           i.scheduled_at, i.location,
           a.company, a.role,
           u.name as user_name, u.email as user_email, u.notify_email
         FROM interviews i
         JOIN applications a ON i.application_id = a.id
         JOIN users u ON i.user_id = u.id
         WHERE i.scheduled_at BETWEEN NOW() + INTERVAL '24 hours'
                                   AND NOW() + INTERVAL '25 hours'
           AND i.reminder_sent = false
           AND u.notify_email = true`
      );

      for (const interview of result.rows) {
        try {
          await sendReminderEmail(interview);
          await pool.query(
            `UPDATE interviews SET reminder_sent = true WHERE id = $1`,
            [interview.id]
          );
          await logEmail(interview, 'sent');
        } catch (err) {
          await logEmail(interview, 'failed', err.message);
        }
      }
    } catch (err) {
      console.error('[EmailReminder] Cron error:', err.message);
    }
  });
};
