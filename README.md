# Data Visualization Dashboard

## Live Demo
🌐 **Deployed at:** [https://answeraiasse.vercel.app/](https://answeraiasse.vercel.app/)

## What is this?
This is a React + TypeScript dashboard for managing and visualizing EV infrastructure data. It uses Firebase for login and has a bunch of interactive UI features. I built it to practice modern React, protected routes, and some dashboard UI stuff.

---

## Features
- **Login/Logout**: Uses Firebase Auth (email/password only, no Google login).
- **Protected Routes**: You have to log in to see the dashboard.
- **Dashboard**: Shows some KPIs, scenario results, and charts (right now, the data is mostly fake/mock).
- **Edit Variables Modal**: You can open a side modal to search, autofill, and rerun variables.
- **Custom Sidebar**: The left menu uses SVG icons from the assets folder (not a library).
- **Responsive**: Works on desktop and mobile, dark theme.

---

## How to run it locally

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd datavisulaizationasse
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Firebase:**
   - Either update `src/firebase.ts` with your Firebase project config, or create a `.env` file with:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
   - Make sure you have at least one user in Firebase Auth (email/password).
4. **Start the dev server:**
   ```bash
   npm run dev
   ```
5. **Go to** [http://localhost:5173](http://localhost:5173) and log in.

---

## Why I did things this way
- **Firebase Auth**: I started with Firestore for login, but switched to Firebase Auth because it's safer and easier for real apps.
- **SVG Icons**: Used SVGs in `/src/assets` for the sidebar so I could match the design exactly.
- **React Context**: Used for auth state, didn't bother with Redux or Zustand since the app is small.
- **Styled-components**: For CSS-in-JS and easy theming.
- **No registration**: Only login is supported. You have to add users in Firebase Console.
- **No Google login**: Just wanted to keep it simple.

---

## What doesn't work / Limitations
- **No registration**: You can't sign up from the app, only log in.
- **Fake data**: The dashboard and variables are just mock data for now.
- **No server-side validation**: All checks are in the frontend.
- **No tests**: Didn't have time to add unit tests.
- **Accessibility**: I didn't do a full accessibility audit.

---

## How long did it take?
- Setup & Firebase: ~1 hour
- Auth, login, protected routes: ~1.5 hours
- Dashboard UI: ~2 hours
- Edit Variables modal: ~2 hours
- Sidebar icons & styling: ~1 hour
- Bug fixes & polish: ~1.5 hours
- **Total:** About 9 hours

---

## Project structure (main files)
- `src/pages/DashboardPage.tsx` — Dashboard UI
- `src/pages/LoginPage.tsx` — Login form
- `src/context/AuthContext.tsx` — Auth logic
- `src/components/EditVariablesPanel.tsx` — The slide-over modal
- `src/assets/` — SVG icons
- `src/firebase.ts` — Firebase config

---

## Anything else?
If you have questions or want to see more features, just ask!
