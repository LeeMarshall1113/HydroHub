import express from 'express';
import pool from '../db.js';

const router = express.Router();

// list valves
router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM valves ORDER BY id');
  res.json(rows);
});

// create valve
router.post('/', async (req, res) => {
  const { name } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO valves(name, state) VALUES ($1, false) RETURNING *',
    [name]
  );
  res.status(201).json(rows[0]);
});

// toggle valve
router.post('/:id/toggle', async (req, res) => {
  const id = req.params.id;
  const { rows } = await pool.query(
    'UPDATE valves SET state = NOT state WHERE id=$1 RETURNING *',
    [id]
  );
  res.json(rows[0]);
});

export default router;
