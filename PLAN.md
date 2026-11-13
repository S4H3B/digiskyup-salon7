# Plan

## Features (core, W1)

1. Services page
2. Booking form with date and time slots
3. Admin dashboard to view and cancel bookings
4. Mandatory: auth (user/admin), hosted DB, validation + error states, responsive, no secrets, live

Stretch done: blocking already-booked slots. Not done: email confirmation.

## Data model (MongoDB Atlas)

- **User**: name, email (unique), phone, password (bcrypt hash, never returned), role `user|admin`
- **Service**: name, category, price, durationMin, description, imageUrl, active
- **Booking**: ref, user→User, service→Service, customerName, customerPhone, stylist, date (YYYY-MM-DD), timeSlot, status `Confirmed|Cancelled`
- Unique partial index on `(stylist, date, timeSlot)` where status = Confirmed

## Screens

Home · Services · Register / Login · Book · My bookings · Admin

## Decisions

- **Only Atlas, Node, React JSX, HTML and CSS:** no UI kit, no router package, no CORS or security packages; small hand-written router and rate limiter instead.
- **Express serves the React build:** one deployment, no cross-origin setup, no frontend env variable.
- **Hash routing (`/#/services`):** works on any host with no rewrite rules.
- **Admin only from the seed script:** role is never read from a request body.
- **Server validates everything again:** the API must be safe on its own.
- **Slot endpoint returns only slot labels:** no customer data leaks.
- **Soft delete for services:** old bookings keep a valid service reference.
