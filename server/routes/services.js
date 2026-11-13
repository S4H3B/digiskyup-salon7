import { Router } from 'express';
import mongoose from 'mongoose';
import { adminOnly, protect } from '../middleware/auth.js';
import Service from '../models/Service.js';
import { isString } from '../utils/config.js';

const router = Router();

const pickFields = (body) => {
  const { name, category, price, durationMin, description, imageUrl, active } = body;
  const data = { name, category, description, imageUrl };
  if (![name, category, description].every(isString)) return null;
  data.price = Number(price);
  data.durationMin = Number(durationMin);
  if (typeof active === 'boolean') data.active = active;
  return data;
};

router.get('/', async (_req, res, next) => {
  try {
    res.json(await Service.find({ active: true }).sort('price'));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    const service = await Service.findOne({ _id: req.params.id, active: true });
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    return res.json(service);
  } catch (err) {
    return next(err);
  }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const data = pickFields(req.body);
    if (!data) return res.status(400).json({ message: 'Invalid service data.' });
    return res.status(201).json(await Service.create(data));
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const data = pickFields(req.body);
    if (!data || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid service data.' });
    }
    const service = await Service.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    return res.json(service);
  } catch (err) {
    return next(err);
  }
});

// Soft delete so past bookings keep their service reference.
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    const service = await Service.findByIdAndUpdate(req.params.id, { active: false });
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    return res.json({ message: 'Service removed.' });
  } catch (err) {
    return next(err);
  }
});

export default router;
