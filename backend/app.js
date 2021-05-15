import express from 'express';
import connectDB from './config/db.js';

export const app = express();

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running'));