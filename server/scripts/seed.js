import bcrypt from 'bcryptjs';
import 'dotenv/config';
import mongoose from 'mongoose';
import Service from '../models/Service.js';
import User from '../models/User.js';

const services = [
  {
    name: 'Signature Haircut & Styling',
    category: 'Hair',
    price: 600,
    durationMin: 45,
    description: 'Consultation, wash, precision cut and blow-dry finish by our senior stylist.',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Beard Trim & Shape-up',
    category: 'Grooming',
    price: 300,
    durationMin: 30,
    description: 'Clean line-up, hot towel and beard conditioning.',
    imageUrl:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Radiance Facial',
    category: 'Skincare',
    price: 1800,
    durationMin: 75,
    description: 'Deep cleansing, exfoliation, massage and hydrating mask.',
    imageUrl:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hair Colour & Gloss',
    category: 'Hair',
    price: 3500,
    durationMin: 120,
    description: 'Full colour or highlights with toning gloss and bond care.',
    imageUrl:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Gel Manicure & Pedicure',
    category: 'Nails',
    price: 1500,
    durationMin: 75,
    description: 'Cuticle care, scrub, massage and long-lasting gel polish.',
    imageUrl:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Head & Shoulder Massage',
    category: 'Spa',
    price: 700,
    durationMin: 30,
    description: 'Relaxing warm-oil massage to release tension.',
    imageUrl:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
  },
];

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

await mongoose.connect(MONGODB_URI);

if ((await Service.countDocuments()) === 0) {
  await Service.insertMany(services);
  console.log(`Seeded ${services.length} services.`);
} else {
  console.log('Services already exist, skipping.');
}

if (ADMIN_EMAIL && ADMIN_PASSWORD) {
  const email = ADMIN_EMAIL.toLowerCase();
  if (await User.exists({ email })) {
    console.log('Admin already exists, skipping.');
  } else {
    await User.create({
      name: 'Salon7 Admin',
      email,
      phone: '9000000000',
      password: await bcrypt.hash(ADMIN_PASSWORD, 10),
      role: 'admin',
    });
    console.log(`Admin created: ${email}`);
  }
} else {
  console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set, admin not created.');
}

await mongoose.disconnect();
