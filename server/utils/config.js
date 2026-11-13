export const STYLISTS = ['Aanya Sharma', 'Rohan Mehta', 'Priya Kapoor'];

export const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
  '07:00 PM',
];

export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Today's date in India (YYYY-MM-DD), so "past date" checks match the salon's timezone.
export const todayIST = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

// Rejects objects/arrays so query operators like {"$ne": ""} can never reach MongoDB.
export const isString = (value) => typeof value === 'string';
