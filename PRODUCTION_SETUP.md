# Production Setup

## Required Environment Variables

Production persistence turns on only when both `DATABASE_URL` and `SESSION_SECRET` are set.  
OpenAI-backed replies turn on only when `OPENAI_API_KEY` is set.  
If the key is absent, inquiries stay on the built-in rules fallback.

```bash
APP_URL=https://your-domain.example
DATABASE_URL=postgres://username:password@host:5432/ichijiuke
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5-mini
OPENAI_TIMEOUT_MS=20000
SESSION_SECRET=replace-with-a-random-string-of-32-or-more-characters
```

- `APP_URL`: public base URL for the deployment.
- `DATABASE_URL`: PostgreSQL connection string.
- `OPENAI_API_KEY`: enables LLM-backed inquiry replies.
- `OPENAI_MODEL`: optional. Defaults to `gpt-5-mini`.
- `OPENAI_TIMEOUT_MS`: optional request timeout for OpenAI calls.
- `SESSION_SECRET`: at least 32 characters. Used to sign seller session cookies.

Without `DATABASE_URL` and `SESSION_SECRET`, the app stays in local demo mode and stores state in cookies.  
Without `OPENAI_API_KEY`, the inquiry engine falls back to the built-in rules engine.

## What You Need To Prepare

1. Provision a PostgreSQL database.
2. Generate a strong `SESSION_SECRET`.
3. Prepare an OpenAI API key if you want AI replies in that environment.
4. Set the environment variables on your hosting platform.
5. Point your domain to the deployment.

## Local Production Check

1. Copy `.env.example` to `.env.local`.
2. Fill in a real `DATABASE_URL` and `SESSION_SECRET`.
3. Add `OPENAI_API_KEY` if you want to test OpenAI replies locally. If omitted, the app stays on rules fallback.
4. Run:

```bash
npm ci
npm run dev
```

5. Open `http://localhost:3000/signup`, create a seller, finish setup, and publish a slug.
6. Open `/c/<slug>` in a separate browser session and submit an inquiry.
7. Verify the inquiry appears in `/inbox`.
8. If `OPENAI_API_KEY` is set, confirm the UI shows `openai` / `OpenAI grounded` instead of `rules fallback`.

## Deployment Flow

1. Push `main`.
2. Confirm GitHub Actions is green.
3. Deploy the repo to your host.
4. Set `APP_URL`, `DATABASE_URL`, `SESSION_SECRET`, and optionally `OPENAI_API_KEY` / `OPENAI_MODEL`.
5. Re-run the signup flow once in production to create the first seller.
6. If you leave `OPENAI_API_KEY` unset, production still runs on rules fallback.

## Current Operational Limits

- Seller authentication is cookie-based and stateless. There is no forced session revocation yet.
- Database schema creation still happens from the app on first access. This should become explicit migrations before heavy production traffic.
- Notifications are stored in-app only. There is no email or Slack delivery yet.
- There is no audit log, rate limiting, captcha, or spam protection yet.
- Public inquiries persist, but buyer identity is not authenticated.
- OpenAI failures fall back to rules mode. There is no provider failover other than that single fallback.
