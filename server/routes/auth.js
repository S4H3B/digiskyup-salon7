import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import { EMAIL_REGEX, PHONE_REGEX, isString } from '../utils/config.js';

const router = Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (![name, email, phone, password].every(isString)) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (name.trim().length < 2) return res.status(400).json({ message: 'Enter your full name.' });
    if (!EMAIL_REGEX.test(email)) return res.status(400).json({ message: 'Enter a valid email.' });
    if (!PHONE_REGEX.test(phone)) {
      return res
        .status(400)
        .json({ message: 'Enter a 10-digit Indian mobile number (starts 6-9).' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const normalized = email.trim().toLowerCase();
    if (await User.exists({ email: normalized })) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Role is never read from the request body: new accounts are always customers.
    const user = await User.create({
      name: name.trim(),
      email: normalized,
      phone,
      password: await bcrypt.hash(password, 10),
    });
    return res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (![email, password].every(isString)) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    return res.json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));

export default router;
