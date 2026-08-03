# Job Tracker Api

Backend app for tracking a job search process

The project allows ussers create job vacancies, track their status, add notes and set reminders. When the reminder time arrives user gets an email with the content of the note.

## Features

- User registration and authentication with JWT
- Password hashing with bcrypt
- User profile management
- CRUD operations for job applications
- Job status tracking:
  - applied
  - interview
  - offer
  - rejected
- Pagination, filtering and sorting of vacancies
- Notes for job applications
- Reminder system for notes
- Email notifications for reminders
- Scheduled background tasks
- Database migrations
- Docker support
- Swagger API documentation

## Tech Stack

### Backend

- Node.js
- NestJS
- TypeScript

### Database

- PostgreSQL
- Neon Database
- Drizzle ORM

### Authentication

- JWT
- Passport
- bcrypt

### Email

- Nodemailer
- Mailtrap SMTP

### Infrastructure

- Docker
- Docker Compose

## Project Structure

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

## Installation

### Clone the repository

```bash
git clone https://github.com/boyakov24/job-tracker-api.git
cd job-tracker-api
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root and fill in the required environment variables.

### Run database migrations

```bash
npm run db:migrate
```

### Start the application

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

## Running with Docker

Build the Docker image:

```bash
docker build -t job-tracker-api .
```

Run the container:

```bash
docker run --env-file .env -p 3000:3000 job-tracker-api
```

Or use Docker Compose:

```bash
docker compose up
```

## API Documentation

After starting the application, Swagger UI is available at:

```text
http://localhost:3000/api
```

Swagger provides interactive documentation for all available API endpoints.

## Available Endpoints

| Method                         | Endpoint        | Description                   |
| ------------------------------ | --------------- | ----------------------------- |
| POST                           | /auth/register  | Register a new user           |
| POST                           | /auth/login     | Login and receive JWT token   |
| GET                            | /auth/profile   | Get current authentiated user |
| PATCH                          | /users/prfoile  | Update email                  |
| PATCH                          | /users/password | Update password               |
| DELETE                         | /users          | Delete user account           |
| POST<br>GET<br>PATCH<br>DELETE | /jobs           | Manage job applications       |
| POST<br>GET<br>PATCH<br>DELETE | /notes          | Manage notes                  |
| POST<br>GET<br>PATCH<br>DELETE | /reminders      | Manage reminders              |

## Database & Migrations

Generate a migration:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

The project uses:

- PostgreSQL
- Neon Database
- Drizzle ORM

## License

This project is licensed under the MIT License.
