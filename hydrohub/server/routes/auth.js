import express from 'express';
import pool from '../db.js';
import { hashPassword, comparePassword, sign } from '../utils/auth.js';

const router = express.Router();

// register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const pwdHash = await hashPassword(password);
  await pool.query('INSERT INTO users(email, password) VALUES ($1, $2)', [
    email,
    pwdHash
  ]);
  res.sendStatus(201);
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [
    email
  ]);
  if (!rows.length) return res.sendStatus(401);
  const match = await comparePassword(password, rows[0].password);
  if (!match) return res.sendStatus(401);
  const token = sign({ id: rows[0].id, email });
  res.json({ token });
});

export default router;
