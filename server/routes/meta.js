import { Router } from 'express';
import { STYLISTS, TIME_SLOTS } from '../utils/config.js';

const router = Router();

// Stylists and slots come from the server so the UI and API can never disagree.
router.get('/', (_req, res) => res.json({ stylists: STYLISTS, timeSlots: TIME_SLOTS }));

export default router;
