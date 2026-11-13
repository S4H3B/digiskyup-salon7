# AI Log

## Tools used

Claude (code generation, debugging help), Gemini (guidance). GitHub, Render, MongoDB Atlas and UptimeRobot for hosting and monitoring.

## Key prompts

1. "Lets make a website for a salon, minimal design but fully working." (with the prototype file and the rules)
2. "we will be using MERN to make this."
3. "Salon name: salon7 , Theme - warm white ,black, we will only use MongoDB Atlas, Node.js and JSX, and HTML and CSS."
4. "Salon7 services could not be found." (I had only run the client)
5. "Deploy failed." (with a screenshot of the Render log)
6. "steps to go fully live without any cost?"
7. "The site feels little dull?"
8. "If someone unknown gets login access, can he take my site away from me?"

## Where the AI got it wrong and how it was fixed

- The first versions needed a separate frontend host and a `VITE_API_URL` setting. It was missing and the site showed an error. The project was redesigned so Express serves the React build and the frontend calls `/api` directly.
- The seed script failed with a duplicate key error because my connection string pointed to the old `glowmax_db` database. I changed the database name in `MONGODB_URI` to `salon7`.
- I ran only the client, so no services appeared. The server and database must run too.
- The first deploy failed because Atlas blocked Render's IP. I added `0.0.0.0/0` under Network Access.
- The AI's code was only syntax-checked, never run against a live database, so all real testing was mine.

## What I wrote or changed by hand

- Created the Atlas cluster and database user, and set the connection string and `JWT_SECRET`.
- Fixed the database name and reset the admin account.
- Created the GitHub repo and uploaded the code in separate commits, with branches and pull requests.
- Deployed on Render, set the environment variables, and added the UptimeRobot monitor.
- Took the screenshots and filled in the README with the live URL and demo credentials.
- Read through the code to understand login, booking and the double-booking block.