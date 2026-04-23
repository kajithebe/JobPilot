import pool from '../db/pool.js';

const ALLOWED_OUTCOMES = ['offer', 'rejected', 'waiting'];

// ── Activity log helper ───────────────────────────────────────────────
const logActivity = async (
  client,
  user_id,
  entity_id,
  action,
  metadata = {}
) => {
  await client.query(
    `INSERT INTO activities (user_id, entity_type, entity_id, action, metadata)
     VALUES ($1, 'interview', $2, $3, $4)`,
    [user_id, entity_id, action, JSON.stringify(metadata)]
  );
};

// POST /api/interviews
export const createInterview = async (req, res) => {
  const user_id = req.user.id;
  const {
    application_id,
    interview_type = 'online',
    scheduled_at,
    location,
    notes,
  } = req.body;

  if (!application_id || !scheduled_at) {
    return res
      .status(400)
      .json({error: 'application_id and scheduled_at are required'});
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO interviews
         (application_id, user_id, interview_type, scheduled_at, location, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [application_id, user_id, interview_type, scheduled_at, location, notes]
    );

    const interview = result.rows[0];

    await logActivity(client, user_id, interview.id, 'scheduled', {
      application_id,
      interview_type,
      scheduled_at,
    });

    await client.query('COMMIT');
    res.status(201).json(interview);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create interview error:', err);
    res.status(500).json({error: 'Internal server error'});
  } finally {
    client.release();
  }
};

// GET /api/interviews
export const getInterviews = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT i.*, a.company, a.role
       FROM interviews i
       JOIN applications a ON i.application_id = a.id
       WHERE i.user_id = $1
       ORDER BY i.scheduled_at ASC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get interviews error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// GET /api/interviews/:id
export const getInterviewById = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;

  try {
    const result = await pool.query(
      `SELECT i.*, a.company, a.role
       FROM interviews i
       JOIN applications a ON i.application_id = a.id
       WHERE i.id = $1 AND i.user_id = $2`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Interview not found'});
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get interview error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// PUT /api/interviews/:id
export const updateInterview = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;
  const {interview_type, scheduled_at, location, notes} = req.body;

  try {
    const result = await pool.query(
      `UPDATE interviews
       SET
         interview_type = COALESCE($1, interview_type),
         scheduled_at   = COALESCE($2, scheduled_at),
         location       = COALESCE($3, location),
         notes          = COALESCE($4, notes),
         updated_at     = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [interview_type, scheduled_at, location, notes, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Interview not found'});
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update interview error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// DELETE /api/interviews/:id
export const deleteInterview = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `DELETE FROM interviews
       WHERE id = $1 AND user_id = $2
       RETURNING id, application_id, interview_type`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({error: 'Interview not found'});
    }

    const {application_id, interview_type} = result.rows[0];
    await logActivity(client, user_id, parseInt(id), 'cancelled', {
      application_id,
      interview_type,
    });

    await client.query('COMMIT');
    res.json({message: 'Interview cancelled successfully'});
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete interview error:', err);
    res.status(500).json({error: 'Internal server error'});
  } finally {
    client.release();
  }
};
