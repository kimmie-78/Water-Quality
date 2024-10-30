// express.js
import express from 'express';
import forumRoutes from './routes/forumRoutes.js'; // Note the .js extension
import dashboardRoutes from './routes/dashboardRoutes.js';
import aquaBotRoutes from './routes/aquaBotRoutes.js'; // Import the new AquaBot routes
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Register routes
app.use('/api/forum', forumRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/aquabot', aquaBotRoutes); 

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(new URL('./indexd.html', import.meta.url).pathname);
  });
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
