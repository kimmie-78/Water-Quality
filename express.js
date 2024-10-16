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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
