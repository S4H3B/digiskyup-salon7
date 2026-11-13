import { Router } from 'express';
import mongoose from 'mongoose';
import { adminOnly, protect } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { DATE_REGEX, STYLISTS, TIME_SLOTS, isString, todayIST } from '../utils/config.js';

const router = Router();

// Which slots are taken for a stylist/day. Returns slot labels only, no customer data.
router.get('/slots', protect, async (req, res, next) => {
  try {
    const { stylist, date } = req.query;
    if (!isString(stylist) || !isString(date) || !DATE_REGEX.test(date)) {
      return res.status(400).json({ message: 'stylist and date are required.' });
    }
    const taken = await Booking.find({ stylist, date, status: 'Confirmed' }).select('timeSlot');
    return res.json({ booked: taken.map((b) => b.timeSlot) });
  } catch (err) {
    return next(err);
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { serviceId, stylist, date, timeSlot } = req.body;
    if (![serviceId, stylist, date, timeSlot].every(isString)) {
      return res.status(400).json({ message: 'Service, stylist, date and time are required.' });
    }
    if (!STYLISTS.includes(stylist)) return res.status(400).json({ message: 'Unknown stylist.' });
    if (!TIME_SLOTS.includes(timeSlot))
      return res.status(400).json({ message: 'Invalid time slot.' });
    if (!DATE_REGEX.test(date) || date < todayIST()) {
      return res.status(400).json({ message: 'Please choose today or a future date.' });
    }
    if (!mongoose.isValidObjectId(serviceId)) {
      return res.status(400).json({ message: 'Invalid service.' });
    }
    const service = await Service.findOne({ _id: serviceId, active: true });
    if (!service) return res.status(404).json({ message: 'Service not available.' });

    const booking = await Booking.create({
      user: req.user._id,
      service: service._id,
      customerName: req.user.name,
      customerPhone: req.user.phone,
      stylist,
      date,
      timeSlot,
    });
    return res.status(201).json(booking);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'That slot was just taken. Please choose another time.' });
    }
    return next(err);
  }
});

router.get('/mine', protect, async (req, res, next) => {
  try {
    const list = await Booking.find({ user: req.user._id })
      .populate('service', 'name price')
      .sort('-date');
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/cancel', protect, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    // Customers can only cancel their own; admins can cancel any.
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.user = req.user._id;
    const booking = await Booking.findOneAndUpdate(filter, { status: 'Cancelled' }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    return res.json(booking);
  } catch (err) {
    return next(err);
  }
});

router.get('/', protect, adminOnly, async (_req, res, next) => {
  try {
    const list = await Booking.find().populate('service', 'name price').sort('date timeSlot');
    res.json(list);
  } catch (err) {
    next(err);
  }
});

export default router;
