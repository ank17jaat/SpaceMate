# SpaceMate Deployment Guide

## Recommended architecture

```
Users
  |
  v
Netlify CDN
  |
  +--> React/Vite SPA
  |
  +--> Browser calls VITE_API_BASE_URL
           |
           v
      AWS App Runner
           |
           +--> Express API
           +--> MongoDB Atlas
           +--> SMTP / Resend
           +--> Clerk
```

## Why this layout

- Netlify is a strong fit for the static Vite frontend.
- AWS App Runner is the simplest AWS option for this Express backend because it keeps the current server model intact.
- MongoDB Atlas stays external, so there is no need to run MongoDB inside AWS.
- Clerk remains the auth provider and Netlify/App Runner just host the app.

## Frontend deployment on Netlify

1. Connect the repo in Netlify.
2. Use these settings:
   - Base directory: `client`
   - Build command: `npm run build:client --prefix ..`
   - Publish directory: `../dist/public`
3. Add frontend environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_BASE_URL=https://your-backend-domain`
4. Deploy and note the generated Netlify domain.

## Backend deployment on AWS App Runner

1. Push this repo to GitHub.
2. In AWS, open App Runner and create a service from source or container.
3. If using the included `Dockerfile`, point App Runner at the repo root.
4. Set port `5000`.
5. Add backend environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI`
   - `CLERK_SECRET_KEY`
   - `SMTP_EMAIL`
   - `SMTP_PASS`
   - `FRONTEND_URL=https://your-site.netlify.app`
   - `APP_URL=https://your-site.netlify.app`
6. After deploy, verify `https://your-backend-domain/api/health`.

## Domain wiring

- Keep it simple first:
  - Frontend: `www.yourdomain.com` -> Netlify
  - Backend: `api.yourdomain.com` -> App Runner
- After DNS is ready:
  - Set `VITE_API_BASE_URL=https://api.yourdomain.com` in Netlify
  - Set `FRONTEND_URL=https://www.yourdomain.com` in AWS

## Security checklist

- Never log MongoDB connection strings or secret keys.
- Restrict backend CORS to your Netlify domain only.
- Keep Clerk keys in environment variables, not in code.
- Use HTTPS everywhere.
- Add rate limiting before public launch.
- Validate request bodies before writes.
- Require backend auth checks for create/delete actions before production launch.

## Structure recommendations

- Keep `client/` and `server/` separate, but treat them as independent deployables.
- Move shared API helpers into `client/src/lib/api.ts` and keep API paths centralized there.
- Add a dedicated `server/middleware/` area if you continue adding auth, validation, and rate limiting.

## Known production follow-ups

- The backend currently trusts client-provided ownership for create/delete flows. Add Clerk token verification on the API before launch.
- Booking payload shapes look inconsistent between some UI screens and MongoDB models. Normalize those contracts before scaling.
- If traffic grows, place CloudFront + WAF in front of App Runner or migrate the API to ECS/Fargate.
