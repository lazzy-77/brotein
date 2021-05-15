import express from 'express';
import connectDB from './config/db.js';

import {ping} from './routes/api/ping.js'
import usersRouter from './routes/api/users.js';
import authRouter from './routes/api/auth.js';
import profileRouter from './routes/api/profile.js';
import postsRouter from './routes/api/post.js';

export const app = express();

// Connect Database
// connectDB();

// Init Middleware
// app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.get('/api/ping', ping);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);
