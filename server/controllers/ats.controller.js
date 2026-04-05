import pool from '../db/pool.js';
import {scoreResume} from '../utils/atsScorer.js';

// POST /api/ats/score
export const getAtsScore = async (req, res) => {
  const {resume_version_id, job_description} = req.body;
  const user_id = req.user.id;

  if (!resume_version_id || !job_description) {
    return res.status(400).json({
      error: 'resume_version_id and job_description are required',
    });
  }

  try {
    // Fetch the resume version
    const result = await pool.query(
      `SELECT content FROM resume_versions
       WHERE id = $1 AND user_id = $2`,
      [resume_version_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Resume version not found'});
    }

    const content = result.rows[0].content;
    const scores = scoreResume(content, job_description);

    res.json(scores);
  } catch (err) {
    console.error('ATS score error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};
