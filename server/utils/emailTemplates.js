export const interviewReminderTemplate = ({
  candidateName,
  company,
  role,
  interviewType,
  scheduledAt,
  location,
}) => {
  const date = new Date(scheduledAt).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const time = new Date(scheduledAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const mapsLink = location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    : null;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f9fafb;font-family:Helvetica,Arial,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background:#2563eb;padding:32px 40px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
            JobPilot
          </h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:13px;">
            Interview Reminder
          </p>
        </div>

        <!-- Body -->
        <div style="padding:32px 40px;">
          <p style="color:#111827;font-size:15px;margin:0 0 8px;">Hi ${candidateName},</p>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 24px;">
            You have an interview coming up in <strong style="color:#2563eb;">24 hours</strong>. Here are the details:
          </p>

          <!-- Interview card -->
          <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:24px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;width:40%;">Company</td>
                <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${company}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;">Role</td>
                <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${role}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;">Type</td>
                <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;text-transform:capitalize;">${interviewType}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;">Date</td>
                <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${date}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;">Time</td>
                <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${time}</td>
              </tr>
              ${
                location
                  ? `
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;">Location</td>
                <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${location}</td>
              </tr>
              `
                  : ''
              }
            </table>
          </div>

          ${
            mapsLink
              ? `
          <!-- Google Maps button -->
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${mapsLink}" 
               style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:600;">
              📍 Open in Google Maps
            </a>
          </div>
          `
              : ''
          }

          <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
            Good luck with your interview! Make sure to prepare well and get a good night's sleep.
          </p>
        </div>

        <!-- Footer -->
        <div style="padding:20px 40px;border-top:1px solid #f3f4f6;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            Sent by JobPilot · Manage your job search smarter
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `Interview Reminder: ${role} at ${company} — Tomorrow`,
    html,
  };
};
