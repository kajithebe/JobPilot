import pool from './pool.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    const passwordHash = await bcrypt.hash('password123', 10);

    await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING
    `,
      ['Test User', 'test@jobpilot.com', passwordHash]
    );

    console.log('✅ Seed completed: test user inserted');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await pool.end();
  }
};

seed();
