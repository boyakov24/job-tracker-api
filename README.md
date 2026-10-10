# Job Tracker API

Backend for a job tracking application.

Users can manage job applications, track their status, add notes, and set reminders. When a reminder time arrives, the user receives an email with the note content.

## Live Demo

- API: https://job-tracker-api-g0bn.onrender.com
- Swagger: https://job-tracker-api-g0bn.onrender.com/api
- Frontend: https://job-tracker-frontend-uggq.onrender.com

## Features

- User registration and authentication with JWT
- Password hashing with bcrypt
- User profile management (email, password, account deletion)
- CRUD for job applications
- Job status tracking: `applied`, `interview`, `offer`, `rejected`
- Pagination, filtering, and sorting
- Notes for job applications
- Reminders for notes
- Email notifications for due reminders
- Scheduled background tasks
- Database migrations with Drizzle
- Docker support
- Swagger API documentation
- Health check endpoint

## Tech Stack

- **Runtime:** Node.js, NestJS, TypeScript
- **Database:** PostgreSQL (Neon), Drizzle ORM
- **Auth:** JWT, Passport, bcrypt
- **Email:** Nodemailer (SMTP / Mailtrap)
- **Infra:** Docker, Docker Compose

## Project Structure

```text
src/
├── auth/
├── users/
├── jobs/
├── notes/
├── reminders/
├── scheduler/
├── mail/
├── db/
├── pipes/
├── health/
└── main.ts
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/boyakov24/job-tracker-api.git
cd job-tracker-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `3000`) |
| `DATABASE_URL` | PostgreSQL connection string (Neon pooled URL) |
| `DIRECT_DATABASE_URL` | Direct PostgreSQL URL for migrations |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `CORS_ORIGIN` | Allowed frontend origin(s), comma-separated |
| `SMTP_HOST` | SMTP host |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASSWORD` | SMTP password |
| `MAIL_FROM` | Sender address for reminder emails |

Example `CORS_ORIGIN` values:

- Local: `http://localhost:5173`
- Production: `https://job-tracker-frontend-uggq.onrender.com`

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start the application

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.  
Swagger UI: `http://localhost:3000/api`

## Running with Docker

Build the image:

```bash
docker build -t job-tracker-api .
```

Run the container:

```bash
docker run --env-file .env -p 3000:3000 job-tracker-api
```

Or with Docker Compose:

```bash
docker compose up
```

> Note: Docker Compose runs only the API container. The database is external (Neon). Make sure `DATABASE_URL` and `DIRECT_DATABASE_URL` in `.env` point to your PostgreSQL instance.

## Available Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive a JWT token |
| `GET` | `/auth/profile` | Get the current authenticated user |
| `PATCH` | `/users/profile` | Update email |
| `PATCH` | `/users/password` | Update password |
| `DELETE` | `/users` | Delete user account |
| `POST` `GET` `PATCH` `DELETE` | `/jobs` | Manage job applications |
| `POST` `GET` | `/jobs/:jobId/notes` | Create / list notes for a job |
| `GET` `PATCH` `DELETE` | `/notes/:noteId` | Manage a specific note |
| `POST` `GET` | `/notes/:noteId/reminders` | Create / get reminder for a note |
| `GET` `PATCH` `DELETE` | `/reminders/:reminderId` | Manage a specific reminder |
| `GET` | `/health` | Health check |

Most endpoints (except register, login, and health) require a Bearer JWT token. Full interactive docs are available in Swagger.

## Database & Migrations

Generate a migration:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

## Testing

Run e2e tests:

```bash
npm run test:e2e
```

## Related Project

This API works together with the frontend:

https://github.com/boyakov24/job-tracker-frontend

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
