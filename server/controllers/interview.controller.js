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

// GET /api/interviews/:id/prep-topics
export const getPrepTopics = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM interview_prep_topics
       WHERE interview_id = $1 AND user_id = $2
       ORDER BY created_at ASC`,
      [id, user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get prep topics error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// POST /api/interviews/:id/prep-topics
export const createPrepTopic = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;
  const {topic} = req.body;

  if (!topic?.trim()) {
    return res.status(400).json({error: 'Topic is required'});
  }

  try {
    const result = await pool.query(
      `INSERT INTO interview_prep_topics (interview_id, user_id, topic)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, user_id, topic.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create prep topic error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// PATCH /api/interviews/:id/prep-topics/:topicId
export const updatePrepTopic = async (req, res) => {
  const user_id = req.user.id;
  const {id, topicId} = req.params;
  const {is_completed, topic} = req.body;

  try {
    const result = await pool.query(
      `UPDATE interview_prep_topics
       SET
         topic        = COALESCE($1, topic),
         is_completed = COALESCE($2, is_completed)
       WHERE id = $3 AND interview_id = $4 AND user_id = $5
       RETURNING *`,
      [topic, is_completed, topicId, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Prep topic not found'});
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update prep topic error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// DELETE /api/interviews/:id/prep-topics/:topicId
export const deletePrepTopic = async (req, res) => {
  const user_id = req.user.id;
  const {id, topicId} = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM interview_prep_topics
       WHERE id = $1 AND interview_id = $2 AND user_id = $3
       RETURNING id`,
      [topicId, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Prep topic not found'});
    }

    res.json({message: 'Prep topic deleted'});
  } catch (err) {
    console.error('Delete prep topic error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// POST /api/interviews/:id/checkin
export const checkInInterview = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;
  const {outcome} = req.body;

  if (!outcome || !ALLOWED_OUTCOMES.includes(outcome)) {
    return res.status(400).json({
      error: 'Invalid outcome',
      allowed: ALLOWED_OUTCOMES,
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update interview
    const interviewResult = await client.query(
      `UPDATE interviews
       SET outcome = $1, checked_in = true, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *, application_id`,
      [outcome, id, user_id]
    );

    if (interviewResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({error: 'Interview not found'});
    }

    const {application_id} = interviewResult.rows[0];

    // Update application status based on outcome
    const statusMap = {
      offer: 'offer',
      rejected: 'rejected',
      waiting: 'interview',
    };

    const newAppStatus = statusMap[outcome];
    if (newAppStatus !== 'interview') {
      await client.query(
        `UPDATE applications
         SET status = $1, updated_at = NOW()
         WHERE id = $2 AND user_id = $3`,
        [newAppStatus, application_id, user_id]
      );
    }

    await logActivity(client, user_id, parseInt(id), 'checked_in', {
      outcome,
      application_id,
    });

    await client.query('COMMIT');
    res.json(interviewResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Check-in error:', err);
    res.status(500).json({error: 'Internal server error'});
  } finally {
    client.release();
  }
};

// GET /api/interviews/pending-checkin
export const getPendingCheckIns = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT i.*, a.company, a.role
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
    console.error('Get pending check-ins error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};
