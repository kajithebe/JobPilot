import pool from '../db/pool.js';
import {generateResumePDF} from '../utils/pdfGenerator.js';

// GET /api/resumes/:id/export/pdf
export const exportResumePDF = async (req, res) => {
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

    const resume = result.rows[0];
    const date = new Date().toISOString().split('T')[0];
    const safeName = resume.name.replace(/[^a-z0-9]/gi, '_');
    const filename = `${safeName}_${date}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const doc = generateResumePDF(resume);
    doc.pipe(res);
  } catch (err) {
    console.error('PDF export error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};
