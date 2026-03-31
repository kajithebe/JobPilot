import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({error: 'No token provided'});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({error: 'User no longer exists'});
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({error: 'Invalid or expired token'});
  }
};

export default verifyToken;
