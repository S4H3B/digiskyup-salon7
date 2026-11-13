# Deployment

## Platforms

- **MongoDB Atlas (M0 free):** database. Does not expire.
- **Render (free web service):** runs Express, which also serves the built React app.

## Steps

### 1. Database
1. Atlas → create a free M0 cluster → Database Access: create a user and password.
2. Network Access: allow `0.0.0.0/0` (Render IP addresses are not fixed).
3. Connect → Drivers → copy the connection string and add the database name: `...mongodb.net/salon7?...`

### 2. Web service on Render
1. Push the repo to GitHub (public).
2. Render → New → Web Service → connect the repo.
3. Settings: Root Directory **empty**, Build Command `npm run build`, Start Command `npm start`, Instance type Free.
4. Environment variables: `MONGODB_URI`, `JWT_SECRET`.
5. Deploy. Open `https://<service>.onrender.com/api/health` → `{"status":"ok"}`, then open the root URL for the site.
6. Seed once from your computer, with `server/.env` pointing to the same Atlas database and your admin email and password: `npm run seed`.

Render redeploys automatically whenever you push to `main`.

## Production environment variables

`MONGODB_URI`, `JWT_SECRET` (Render sets `PORT` itself). `ADMIN_EMAIL` and `ADMIN_PASSWORD` are only needed on the machine where you run the seed.

## Redeploy / roll back

- Redeploy: push to `main`, or Render → Manual Deploy.
- Roll back: Render → Events → Rollback to a previous deploy, or `git revert` and push.

## Free-tier limits

- **Render free sleeps after 15 minutes idle**; a cold start takes 30–60 seconds. An UptimeRobot monitor on `/api/health` every 5 minutes keeps it awake. Free instances also have monthly hour limits.
- Atlas M0: 512 MB storage, shared CPU.

## Post-deployment report

- [x] Log in as admin and as a user on the live URL
- [x] Book end to end; document visible in Atlas `bookings`
- [x] Book the same slot from a second account → rejected
- [x] Tested on a real phone over mobile data
- [x] Turn off internet → offline banner / error message, no crash
- [x] Lighthouse: Performance 41 / Accessibility 95 / Best Practices 100 / SEO 100
Performance is lower mainly because of Render's free-tier server response time and external images and fonts. Possible improvements: compress and resize images, host fonts locally, add caching.
- [x] HTTPS OK, no console errors, title and favicon set
- [x] UptimeRobot monitor on the live URL and `/api/health`
