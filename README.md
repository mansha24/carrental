This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Database setup

This website uses PostgreSQL with Neon. After you connect your Neon database to Vercel, make sure the environment variable `DATABASE_URL` is set.

For local development, copy the example file to `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and paste your Neon connection string for `DATABASE_URL`.

### SMTP email setup

To enable actual notification emails, set up SMTP variables in your `.env.local` file. Example:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-app-password
SMTP_FROM="Car Rental <your-email@gmail.com>"
```

If you use Gmail, you may need an App Password and to enable SMTP access in your account settings.

To initialize the schema and seed the fleet, load the env file and run:

```bash
source .env.local
psql "$DATABASE_URL" -f db/schema.sql
```

Or run `psql` directly with your connection string:

```bash
psql "postgresql://username:password@host:port/database?sslmode=require" -f db/schema.sql
```

> If `psql` tries to connect on `/var/run/postgresql/.s.PGSQL.5432`, that means `DATABASE_URL` was not set in your current shell.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
