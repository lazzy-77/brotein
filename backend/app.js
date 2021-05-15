import express from 'express';
import connectDB from './config/db.js';

import usersRouter from './routes/api/users.js';
import authRouter from './routes/api/auth.js';
import profileRouter from './routes/api/profile.js';
import postsRouter from './routes/api/post.js';

export const app = express();

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);
