# Fitness+ Backend System

## Setup Instructions
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up PostgreSQL and update the database configuration in `src/app.module.ts`.
4. Run the application: `npm run start:dev`
5. Create an env file having your own gmail and password.just like the below.please replace with the right info
GMAIL_USER = "example@gmail.com"

GMAIL_PASS = "examplepassword"

## Design Choices
- Used Nest.js for a scalable and modular architecture.
- TypeORM for database interactions.
- Nodemailer for email notifications.

## Assumptions
- Due dates are calculated based on the membership start date.
- Email service provider is Gmail.

## How to Run the Cron Job
- The cron job is set to run daily at midnight to check for upcoming due dates and send reminder emails.

## To fetch all memberships locally,use the below url on postman
http://localhost:3000/memberships


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test



