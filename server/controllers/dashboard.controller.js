import pool from '../db/pool.js';

// GET /api/dashboard/stats
export const getStats = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'wishlist')   AS wishlist,
         COUNT(*) FILTER (WHERE status = 'applied')    AS applied,
         COUNT(*) FILTER (WHERE status = 'interview')  AS interview,
         COUNT(*) FILTER (WHERE status = 'offer')      AS offer,
         COUNT(*) FILTER (WHERE status = 'rejected')   AS rejected,
         COUNT(*) FILTER (WHERE status = 'withdrawn')  AS withdrawn,
         COUNT(*)                                       AS total
       FROM applications
       WHERE user_id = $1 AND is_deleted = false`,
      [user_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// GET /api/dashboard/alerts
export const getAlerts = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT i.id, i.scheduled_at, i.interview_type,
              a.company, a.role
       FROM interviews i
       JOIN applications a ON i.application_id = a.id
       WHERE i.user_id = $1
         AND i.checked_in = false
         AND i.scheduled_at < NOW()
       ORDER BY i.scheduled_at ASC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get alerts error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// GET /api/dashboard/charts
export const getChartData = async (req, res) => {
  const user_id = req.user.id;
  const {days = 30} = req.query;

  try {
    const timeline = await pool.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM applications
       WHERE user_id = $1
         AND is_deleted = false
         AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [user_id]
    );

    const funnel = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM applications
       WHERE user_id = $1 AND is_deleted = false
       GROUP BY status`,
      [user_id]
    );

    const outcomes = await pool.query(
      `SELECT outcome, COUNT(*) AS count
       FROM interviews
       WHERE user_id = $1 AND outcome IS NOT NULL
       GROUP BY outcome`,
      [user_id]
    );

    res.json({
      timeline: timeline.rows,
      funnel: funnel.rows,
      outcomes: outcomes.rows,
    });
  } catch (err) {
    console.error('Get chart data error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// GET /api/dashboard/activities
export const getActivities = async (req, res) => {
  const user_id = req.user.id;
  const {limit = 20, offset = 0} = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM activities
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [user_id, parseInt(limit), parseInt(offset)]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get activities error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};
