# Production Setup

## Required Environment Variables

The app switches to production persistence only when both `DATABASE_URL` and `SESSION_SECRET` are set.

```bash
APP_URL=https://your-domain.example
DATABASE_URL=postgres://username:password@host:5432/ichijiuke
SESSION_SECRET=replace-with-a-random-string-of-32-or-more-characters
```

- `APP_URL`: public base URL for the deployment.
- `DATABASE_URL`: PostgreSQL connection string.
- `SESSION_SECRET`: at least 32 characters. Used to sign seller session cookies.

Without `DATABASE_URL` and `SESSION_SECRET`, the app stays in local demo mode and stores state in cookies.

## What You Need To Prepare

1. Provision a PostgreSQL database.
2. Generate a strong `SESSION_SECRET`.
3. Set the environment variables on your hosting platform.
4. Point your domain to the deployment.

No AI API key is required right now. Inquiry classification is still rule-based.

## Local Production Check

1. Copy `.env.example` to `.env.local`.
2. Fill in a real `DATABASE_URL` and `SESSION_SECRET`.
3. Run:

```bash
npm ci
npm run dev
```

4. Open `http://localhost:3000/signup`, create a seller, finish setup, and publish a slug.
5. Open `/c/<slug>` in a separate browser session and submit an inquiry.
6. Verify the inquiry appears in `/inbox`.

## Deployment Flow

1. Push `main`.
2. Confirm GitHub Actions is green.
3. Deploy the repo to your host.
4. Set `APP_URL`, `DATABASE_URL`, and `SESSION_SECRET`.
5. Re-run the signup flow once in production to create the first seller.

## Current Operational Limits

- Seller authentication is cookie-based and stateless. There is no forced session revocation yet.
- Database schema creation still happens from the app on first access. This should become explicit migrations before heavy production traffic.
- Notifications are stored in-app only. There is no email or Slack delivery yet.
- There is no audit log, rate limiting, captcha, or spam protection yet.
- Public inquiries persist, but buyer identity is not authenticated.
