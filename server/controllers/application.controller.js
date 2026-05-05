import pool from '../db/pool.js';

const ALLOWED_STATUSES = [
  'wishlist',
  'applied',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
];

const ALLOWED_TRANSITIONS = {
  wishlist: ['applied', 'withdrawn'],
  applied: ['interview', 'rejected', 'withdrawn'],
  interview: ['offer', 'rejected', 'withdrawn'],
  offer: ['withdrawn'],
  rejected: [],
  withdrawn: [],
};

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
     VALUES ($1, 'application', $2, $3, $4)`,
    [user_id, entity_id, action, JSON.stringify(metadata)]
  );
};

// POST /api/applications
export const createApplication = async (req, res) => {
  const user_id = req.user.id;
  const {
    company,
    role,
    job_url,
    location,
    salary,
    notes,
    resume_version_id,
    status = 'wishlist',
  } = req.body;

  if (!company || !role) {
    return res.status(400).json({error: 'Company and role are required'});
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({error: 'Invalid status'});
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO applications
         (user_id, company, role, job_url, location, salary, notes, resume_version_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        user_id,
        company,
        role,
        job_url,
        location,
        salary,
        notes,
        resume_version_id || null,
        status,
      ]
    );

    const application = result.rows[0];

    await logActivity(client, user_id, application.id, 'created', {
      company,
      role,
      status,
    });

    // Fetch with join so resume_name and resume_version_name are included
    const full = await client.query(
      `SELECT a.*, rv.version_name as resume_version_name, r.name as resume_name
       FROM applications a
       LEFT JOIN resume_versions rv ON a.resume_version_id = rv.id
       LEFT JOIN resumes r ON rv.resume_id = r.id
       WHERE a.id = $1`,
      [application.id]
    );

    await client.query('COMMIT');
    res.status(201).json(full.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create application error:', err);
    res.status(500).json({error: 'Internal server error'});
  } finally {
    client.release();
  }
};

// GET /api/applications
export const getApplications = async (req, res) => {
  const user_id = req.user.id;
  const {status, sort_by = 'updated_at', order = 'desc', search} = req.query;

  const allowedSortFields = [
    'updated_at',
    'created_at',
    'company',
    'role',
    'status',
  ];
  const allowedOrders = ['asc', 'desc'];

  const sortField = allowedSortFields.includes(sort_by)
    ? sort_by
    : 'updated_at';
  const sortOrder = allowedOrders.includes(order.toLowerCase())
    ? order.toUpperCase()
    : 'DESC';

  try {
    let query = `
      SELECT a.*, rv.version_name as resume_version_name, r.name as resume_name
      FROM applications a
      LEFT JOIN resume_versions rv ON a.resume_version_id = rv.id
      LEFT JOIN resumes r ON rv.resume_id = r.id
      WHERE a.user_id = $1 AND a.is_deleted = false
    `;
    const params = [user_id];
    let paramIndex = 2;

    if (status && ALLOWED_STATUSES.includes(status)) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (search) {
      query += ` AND (a.company ILIKE $${paramIndex} OR a.role ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY a.${sortField} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// GET /api/applications/:id
export const getApplicationById = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;

  try {
    const result = await pool.query(
      `SELECT a.*, rv.version_name as resume_version_name, r.name as resume_name
       FROM applications a
       LEFT JOIN resume_versions rv ON a.resume_version_id = rv.id
       LEFT JOIN resumes r ON rv.resume_id = r.id
       WHERE a.id = $1 AND a.user_id = $2 AND a.is_deleted = false`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Application not found'});
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get application error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// PUT /api/applications/:id
export const updateApplication = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;
  const {company, role, job_url, location, salary, notes, resume_version_id} =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE applications
       SET
         company           = COALESCE($1, company),
         role              = COALESCE($2, role),
         job_url           = COALESCE($3, job_url),
         location          = COALESCE($4, location),
         salary            = COALESCE($5, salary),
         notes             = COALESCE($6, notes),
         resume_version_id = COALESCE($7, resume_version_id),
         updated_at        = NOW()
       WHERE id = $8 AND user_id = $9 AND is_deleted = false
       RETURNING *`,
      [
        company,
        role,
        job_url,
        location,
        salary,
        notes,
        resume_version_id || null,
        id,
        user_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Application not found'});
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update application error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// PATCH /api/applications/:id/status
export const updateApplicationStatus = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;
  const {status} = req.body;

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({error: 'Invalid status'});
  }

  const client = await pool.connect();
  try {
    // Fetch current status
    const current = await client.query(
      `SELECT status FROM applications
       WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
      [id, user_id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({error: 'Application not found'});
    }

    const currentStatus = current.rows[0].status;

    // Validate transition
    if (!ALLOWED_TRANSITIONS[currentStatus].includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from "${currentStatus}" to "${status}"`,
        allowed: ALLOWED_TRANSITIONS[currentStatus],
      });
    }

    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE applications
       SET status = $1, updated_at = NOW()
       ${status === 'applied' ? ', applied_at = NOW()' : ''}
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, id, user_id]
    );

    await logActivity(client, user_id, parseInt(id), 'status_changed', {
      from: currentStatus,
      to: status,
    });

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update status error:', err);
    res.status(500).json({error: 'Internal server error'});
  } finally {
    client.release();
  }
};

// DELETE /api/applications/:id — soft delete
export const deleteApplication = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE applications
       SET is_deleted = true, updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND is_deleted = false
       RETURNING id, company, role`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({error: 'Application not found'});
    }

    const {company, role} = result.rows[0];
    await logActivity(client, user_id, parseInt(id), 'deleted', {
      company,
      role,
    });

    await client.query('COMMIT');
    res.json({message: 'Application deleted successfully'});
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete application error:', err);
    res.status(500).json({error: 'Internal server error'});
  } finally {
    client.release();
  }
};
