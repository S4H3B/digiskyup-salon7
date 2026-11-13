# Changelog
## [1.0.1] - 2026-11-14

### Fixed
- Seed script failed against an old database; switched to a fresh `salon7` database
- Deploy failed because Atlas blocked Render; allowed 0.0.0.0/0 in Network Access
- Reset the demo admin account with a new password

### Added
- UptimeRobot monitor on `/api/health`
- Live URL, screenshots and demo credentials in the README
- Post-deployment report in `DEPLOYMENT.md`

## [1.0.0] - 2026-11-12

### Added
- Express + MongoDB Atlas server: auth, services, bookings, admin routes, seed script
- Unique partial index to block double bookings
- React (JSX) + CSS client: services search/filter, register/login, booking flow, my bookings, admin dashboard
- Hand-written hash router and rate limiter (no extra packages)
- Offline banner and loading/empty/error states
- Single deployment: Express serves the built client
