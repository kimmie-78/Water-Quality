import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { isSafe, replaceNullWithZero } from './is_safe.js';


const router = express.Router();
const dbPromise = sqlite.open({
    filename: './water_quality.db',
    driver: sqlite3.Database
});

// Create a new water sample
router.post('/samples', async (req, res) => {
    const sample = req.body;
    replaceNullWithZero(sample);
    sample.is_safe = isSafe(sample);

    const query = `INSERT INTO water_samples 
                    (aluminium, ammonia, arsenic, barium, cadmium, chloramine, chromium, copper, fluoride, bacteria, viruses, lead, nitrates, nitrites, mercury, perchlorate, radium, selenium, silver, uranium, is_safe) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        sample.aluminium, sample.ammonia, sample.arsenic, sample.barium, sample.cadmium,
        sample.chloramine, sample.chromium, sample.copper, sample.fluoride, sample.bacteria,
        sample.viruses, sample.lead, sample.nitrates, sample.nitrites, sample.mercury,
        sample.perchlorate, sample.radium, sample.selenium, sample.silver, sample.uranium,
        sample.is_safe
    ];

    try {
        const db = await dbPromise;
        const result = await db.run(query, params);
        const id = result.lastID;

        res.status(201).json({ id, ...sample });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Retrieve all water samples
router.get('/samples', async (req, res) => {
    const query = `SELECT * FROM water_samples`;
  
    try {
      const db = await dbPromise;
      const rows = await db.all(query);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// Retrieve a specific water sample by ID
router.get('/samples/:id', async (req, res) => {
    const query = `SELECT * FROM water_samples WHERE id = ?`;
    try {
        const db = await dbPromise;
        const row = await db.get(query, [req.params.id]);
        if (!row) {
            return res.status(404).json({ error: "Sample not found" });
        }
        res.json(row);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Update a specific water sample by ID
router.put('/samples/:id', async (req, res) => {
    const sample = req.body;
    replaceNullWithZero(sample);
    sample.is_safe = isSafe(sample);

    const query = `UPDATE water_samples 
                    SET aluminium = ?, ammonia = ?, arsenic = ?, barium = ?, cadmium = ?, chloramine = ?, 
                        chromium = ?, copper = ?, fluoride = ?, bacteria = ?, viruses = ?, lead = ?, 
                        nitrates = ?, nitrites = ?, mercury = ?, perchlorate = ?, radium = ?, selenium = ?, 
                        silver = ?, uranium = ?, is_safe = ? 
                    WHERE id = ?`;

    const params = [
        sample.aluminium, sample.ammonia, sample.arsenic, sample.barium, sample.cadmium,
        sample.chloramine, sample.chromium, sample.copper, sample.fluoride, sample.bacteria,
        sample.viruses, sample.lead, sample.nitrates, sample.nitrites, sample.mercury,
        sample.perchlorate, sample.radium, sample.selenium, sample.silver, sample.uranium,
        sample.is_safe, req.params.id
    ];

    try {
        const db = await dbPromise;
        const result = await db.run(query, params);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Sample not found" });
        }
        res.json({ id: req.params.id, ...sample });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Remove a specific water sample by ID
router.delete('/samples/:id', async (req, res) => {
    const query = `DELETE FROM water_samples WHERE id = ?`;

    try {
        const db = await dbPromise;
        const result = await db.run(query, [req.params.id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Sample not found" });
        }
        res.json({ message: "Sample deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Export the router
export default router;
