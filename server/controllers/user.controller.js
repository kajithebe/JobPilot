import pool from '../db/pool.js';
import bcrypt from 'bcryptjs';

// GET /api/users/profile
export const getProfile = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT id, name, email, notify_email, created_at FROM users WHERE id = $1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'User not found'});
    }

    const user = result.rows[0];
    res.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferences: {
          emailNotifications: user.notify_email,
        },
      },
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  const user_id = req.user.id;
  const {name, email} = req.body;

  try {
    // Check email not taken by another user
    if (email) {
      const existing = await pool.query(
        `SELECT id FROM users WHERE email = $1 AND id != $2`,
        [email, user_id]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({error: 'Email already in use'});
      }
    }

    const result = await pool.query(
      `UPDATE users
       SET
         name       = COALESCE($1, name),
         email      = COALESCE($2, email),
         updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email`,
      [name, email, user_id]
    );

    res.json({data: result.rows[0]});
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// POST /api/users/change-password
export const changePassword = async (req, res) => {
  const user_id = req.user.id;
  const {currentPassword, newPassword} = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({error: 'Current and new password are required'});
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({error: 'New password must be at least 6 characters'});
  }

  try {
    const result = await pool.query(
      `SELECT password FROM users WHERE id = $1`,
      [user_id]
    );

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({error: 'Current password is incorrect'});
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await pool.query(
      `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
      [hashed, user_id]
    );

    res.json({success: true});
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// PUT /api/users/preferences
export const updatePreferences = async (req, res) => {
  const user_id = req.user.id;
  const {emailNotifications} = req.body;

  try {
    await pool.query(
      `UPDATE users SET notify_email = $1, updated_at = NOW() WHERE id = $2`,
      [emailNotifications, user_id]
    );

    res.json({data: {emailNotifications}});
  } catch (err) {
    console.error('Update preferences error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};

// DELETE /api/users/me
export const deleteAccount = async (req, res) => {
  const user_id = req.user.id;

  try {
    await pool.query(
      `UPDATE users SET is_deleted = true, updated_at = NOW() WHERE id = $1`,
      [user_id]
    );

    res.json({success: true});
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};
