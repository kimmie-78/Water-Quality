// express.js
import express from 'express';
import forumRoutes from './routes/forumRoutes.js'; // Note the .js extension
import dashboardRoutes from './routes/dashboardRoutes.js';

import cors from 'cors';

const app = express();


// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Register routes
app.use('/api/forum', forumRoutes);
app.use('/api/dashboard', dashboardRoutes);

<<<<<<< HEAD
    await db.migrate();

    // Create a new water sample
    app.post('/api/samples', async (req, res) => {
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
            const result = await db.run(query, params);
            const id = result.lastID;

            // Emit a real-time alert if the sample is unsafe
            if (!sample.is_safe) {
                io.emit('alert', 'Water is unsafe due to contaminants');
            }

            res.status(201).json({ id, ...sample });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    // Retrieve all water samples
    app.get('/api/samples', async (req, res) => {
        const query = `SELECT * FROM water_samples`;
        try {
            const rows = await db.all(query);
            res.json(rows);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    // Retrieve a specific water sample by ID
    app.get('/api/samples/:id', async (req, res) => {
        const query = `SELECT * FROM water_samples WHERE id = ?`;
        try {
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
    app.put('/api/samples/:id', async (req, res) => {
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
    app.delete('/api/samples/:id', async (req, res) => {
        const query = `DELETE FROM water_samples WHERE id = ?`;

        try {
            const result = await db.run(query, [req.params.id]);
            if (result.changes === 0) {
                return res.status(404).json({ error: "Sample not found" });
            }
            res.json({ message: "Sample deleted successfully" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    // Start the server after database setup
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

})();

// Set up a connection with Socket.io
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});






=======
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
>>>>>>> 74308063092e7fde8e9f9802b5c4cb025b506513
