import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import metaRoutes from './routes/meta.js';
import serviceRoutes from './routes/services.js';
import { rateLimit } from './utils/rateLimit.js';

const { MONGODB_URI, JWT_SECRET, PORT = 5000 } = process.env;

if (!MONGODB_URI || !JWT_SECRET) {
  console.error(
    'Missing MONGODB_URI or JWT_SECRET. Copy server/.env.example to server/.env and fill it in.',
  );
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1); // behind Render's proxy, so rate limiting sees real IPs
app.disable('x-powered-by');

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.json({ limit: '50kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many attempts. Try again in a few minutes.',
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/meta', metaRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found.' }));

// Serve the built React app (client/dist) from the same server.
const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/dist');
if (fs.existsSync(distDir)) app.use(express.static(distDir));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  return res.status(500).json({ message: 'Server error. Please try again.' });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`salon7 running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
