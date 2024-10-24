import express from 'express';
import * as sqlite from 'sqlite';

import sqlite3 from 'sqlite3';


const router = express.Router();
const dbPromise = sqlite.open({
  filename: './database.db',
  driver: sqlite3.Database
});

// API to get posts with pagination
router.get('/posts', async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const db = await dbPromise;
    const rows = await db.all('SELECT * FROM posts LIMIT ? OFFSET ?', [limit, offset]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// Get all comments for a post
router.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const db = await dbPromise;
    const rows = await db.all('SELECT * FROM comments WHERE post_id = ?', [postId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
});

// Add a new comment
router.post('/comments', async (req, res) => {
  const { post_id, comment } = req.body;
  try {
    const db = await dbPromise;
    const result = await db.run('INSERT INTO comments (post_id, comment) VALUES (?, ?)', [post_id, comment]);
    res.status(201).json({ id: result.lastID });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Create a new post
router.post('/posts/new', async (req, res) => {
  const { title, name, profession, description, link } = req.body;

  if (!title || !name || !profession || !description || !link) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = await dbPromise;
    const result = await db.run('INSERT INTO posts (title, name, profession, description, link) VALUES (?, ?, ?, ?, ?)', 
    [title, name, profession, description, link]);
    const newPost = await db.get('SELECT * FROM posts WHERE id = ?', [result.lastID]);
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Export the router
export default router;