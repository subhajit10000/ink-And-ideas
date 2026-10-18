# Ink & Ideas API

## Setup
1. Run `npm install`.
2. Configure `.env` with the variables required by `src/config/env.js`: `PORT=5001`, `MONGO_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CRYPTO_SECRET` (64-character hex string), and `CLIENT_URL`.
3. Configure SMTP for email OTP verification: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and optionally `EMAIL_FROM`. For Gmail, use an App Password rather than your account password. Registration creates an unverified account and emails a 6-digit OTP; users cannot sign in until `/api/v1/auth/verify-email` accepts that code. OTPs expire after `OTP_EXPIRY_MINUTES`.
4. For image uploads, also set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` from your Cloudinary dashboard. Images are uploaded from the device via multipart form-data and stored in Cloudinary; an 8 MB limit applies.
5. Run `npm start`. A sample configuration is provided in `.env.example`; copy it to `.env` and replace all placeholder secrets.

The API base URL is `http://localhost:5001/api/v1` by default. Public posts can be read without authentication. Creating/editing posts and profile changes require a bearer access token. Users may edit their own posts; admins may delete any post.
