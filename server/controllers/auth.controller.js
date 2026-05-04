import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// POST /api/auth/register
export const register = async (req, res) => {
  const {name, email, password} = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({error: 'Name, email and password are required'});
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check duplicate email
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND is_deleted = false',
      [normalizedEmail]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({error: 'Email already in use'});
    }

    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name.trim(), normalizedEmail, hashed]
    );

    const user = result.rows[0];
    const token = signToken(user.id);

    res.status(201).json({token, user});
  } catch (err) {
    // Handle race condition on unique constraint
    if (err.code === '23505') {
      return res.status(409).json({error: 'Email already in use'});
    }
    console.error('Register error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  const {email, password} = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({error: 'Email and password are required'});
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_deleted = false',
      [normalizedEmail]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({error: 'Invalid email or password'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({error: 'Invalid email or password'});
    }

    const token = signToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.json({
    message: 'Logged out successfully. Please delete the token on the client.',
  });
};
