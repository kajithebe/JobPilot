import pool from '../db/pool.js';

// Default JSONB content structure for a new resume
const defaultContent = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    linkedin: '',
    github: '',
    website: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

const defaultSectionOrder = [
  'personalInfo',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
];

// POST /api/resumes
export const createResume = async (req, res) => {
  const {
    name,
    template = 'modern',
    theme_config = {},
    content,
    section_order,
  } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO resumes (user_id, name, template, theme_config, content, section_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        user_id,
        name,
        template,
        JSON.stringify(theme_config),
        JSON.stringify(content || defaultContent),
        section_order || defaultSectionOrder,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create resume error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// GET /api/resumes
export const getResumes = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT id, name, template, theme_config, section_order, created_at, updated_at
       FROM resumes
       WHERE user_id = $1 AND is_deleted = false
       ORDER BY updated_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get resumes error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// GET /api/resumes/:id
export const getResumeById = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM resumes
       WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Resume not found'});
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// PUT /api/resumes/:id
export const updateResume = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;
  const {name, template, theme_config, content, section_order} = req.body;

  try {
    const result = await pool.query(
      `UPDATE resumes
       SET
         name          = COALESCE($1, name),
         template      = COALESCE($2, template),
         theme_config  = COALESCE($3, theme_config),
         content       = COALESCE($4, content),
         section_order = COALESCE($5, section_order),
         updated_at    = NOW()
       WHERE id = $6 AND user_id = $7 AND is_deleted = false
       RETURNING *`,
      [
        name,
        template,
        theme_config ? JSON.stringify(theme_config) : null,
        content ? JSON.stringify(content) : null,
        section_order || null,
        id,
        user_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Resume not found'});
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update resume error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// DELETE /api/resumes/:id — soft delete
export const deleteResume = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;

  try {
    const result = await pool.query(
      `UPDATE resumes
       SET is_deleted = true, updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND is_deleted = false
       RETURNING id`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Resume not found'});
    }

    res.json({message: 'Resume deleted successfully'});
  } catch (err) {
    console.error('Delete resume error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// POST /api/resumes/:id/versions
export const createVersion = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;
  const {version_name} = req.body;

  try {
    // Fetch current resume
    const resume = await pool.query(
      `SELECT * FROM resumes
       WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
      [id, user_id]
    );

    if (resume.rows.length === 0) {
      return res.status(404).json({error: 'Resume not found'});
    }

    const r = resume.rows[0];

    // Create immutable snapshot
    const result = await pool.query(
      `INSERT INTO resume_versions
         (resume_id, user_id, version_name, template, theme_config, content, section_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        r.id,
        user_id,
        version_name,
        r.template,
        JSON.stringify(r.theme_config),
        JSON.stringify(r.content),
        r.section_order,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create version error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// GET /api/resumes/:id/versions
export const getVersions = async (req, res) => {
  const user_id = req.user.id;
  const {id} = req.params;

  try {
    const result = await pool.query(
      `SELECT id, resume_id, version_name, template, theme_config, section_order, created_at
       FROM resume_versions
       WHERE resume_id = $1 AND user_id = $2
       ORDER BY created_at DESC`,
      [id, user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get versions error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};
