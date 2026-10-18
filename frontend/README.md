# Ink & Ideas frontend

Built with React, Vite, Tailwind CSS, React Router and Lucide icons.

## Run
1. `npm install`
2. Optional `.env`: `VITE_API_URL=http://localhost:5001/api/v1` (this is also the default).
3. `npm run dev`

The homepage is a static editorial landing page with hardcoded inspirational quotes and a separate community feed. Login and registration pages intentionally omit the shared navbar/footer. Authenticated users can manage their profile, username, bio, profile photo, password, and posts from `/dashboard`. Registration sends a 6-digit OTP to the supplied email; the user must verify it before logging in. The backend needs working SMTP credentials for this flow. Image uploads use a device file picker and require the backend Cloudinary environment variables. The logout action is intentionally available only inside the dashboard.
