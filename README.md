# Playground Slot Booking

**Playground Slot Booking** is a web application built with **SvelteKit** and **Auth.js** that allows NSU students and administrators to book and manage university playground time slots.  
It uses **Google Workspace authentication** and connects to a **Google Apps Script backend** powered by Google Sheets.

> Live: [playground-slot-booking.vercel.app](https://playground-slot-booking.vercel.app)

---

## Overview

The application provides a secure and efficient way to handle playground reservations for NSU users.  
Authentication is handled through **Auth.js (Google OAuth)**, ensuring that only NSU Workspace accounts can access booking features.  
All slot data is stored and managed via a **Google Apps Script API**, offering a lightweight and scalable backend solution.

---

## Core Features

- **Google Workspace Login** — restricted to `@northsouth.edu`
- **Real-time Slot Management** — view, book, and cancel slots
- **Role-Based Access** — admin vs. user views
- **Spreadsheet Backend** — Google Sheets as database
- **Instant Deployment** — fully serverless on Vercel

---

## Tech Stack

| Layer | Technology |
| :----- | :---------- |
| Framework | [SvelteKit](https://kit.svelte.dev) |
| Authentication | [Auth.js](https://authjs.dev) (Google Provider) |
| Backend | [Google Apps Script](https://developers.google.com/apps-script) |
| Data Store | Google Sheets |
| Hosting | [Vercel](https://vercel.com) |

---

## Environment Variables

```bash
AUTH_GOOGLE_ID="xyz.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="abc"
AUTH_SECRET="xyz"
BACKEND_APP_SCRIPT_ID="sdfadf"
````

| Variable                | Purpose                                             |
| ----------------------- | --------------------------------------------------- |
| `AUTH_GOOGLE_ID`        | Google OAuth Client ID                              |
| `AUTH_GOOGLE_SECRET`    | Google OAuth Client Secret                          |
| `AUTH_SECRET`           | Session encryption key used by Auth.js              |
| `BACKEND_APP_SCRIPT_ID` | Google Apps Script deployment ID (backend endpoint) |

---

## Authentication

Implemented via [Auth.js for SvelteKit](https://authjs.dev/reference/sveltekit).
Only users with NSU Workspace emails are allowed to sign in. This restriction is enforced via Google authentication configuration.



---


## Project Structure

```bash
src/
├─ components/
├─ lib/
├─ routes/
│  ├─ admin/dashboard/
│  ├─ dashboard/
│  ├─ api/
│  ├─ post-signin-role/
│  ├─ signin/
│  ├─ signout/
│  ├─ +layout.svelte
│  ├─ +layout.server.ts
│  └─ +page.svelte
├─ app.html
├─ app.css
├─ auth.ts
├─ hooks.server.ts
└─ style.css
```

---

## Development

```bash
git clone https://github.com/taemie0/Playground-Slot-Booking.git
cd Playground-Slot-Booking
npm install
npm run dev
```

App runs at → [http://localhost:5173](http://localhost:5173)

---

## Build & Deployment

**Build locally**

```bash
npm run build
```

**Preview**

```bash
npm run preview
```

**Deploy**

* Push to `main` → Vercel auto-builds.
* Add `.env` variables in Vercel project settings.

---

## Backend Integration

This frontend communicates with a Google Apps Script backend derived from
[Tanvir’s Slot Booking System](https://github.com/tan7vir/Slot-Booking-System).

Backend endpoint pattern:

```
https://script.google.com/macros/s/${BACKEND_APP_SCRIPT_ID}/exec
```

To deploy your own backend:

1. Open [Google Apps Script](https://script.google.com).
2. Deploy as **Web App → Anyone with link**.
3. Copy the **Deployment ID**.
4. Update `.env` → `BACKEND_APP_SCRIPT_ID="your-id"`.

---

## Roles & Permissions

| Role      | Capabilities                                          |
| :-------- | :---------------------------------------------------- |
| **Admin** | Manage all bookings, slots                         |
| **User**  | Book or view slots (must use NSU Workspace account) |

---

## License

MIT © 2025
Developed by [@taemie0](https://github.com/taemie0)
Backend by [@tan7vir](https://github.com/tan7vir)

---

## Acknowledgements

* [Auth.js](https://authjs.dev)
* [SvelteKit](https://kit.svelte.dev)
* [Vercel](https://vercel.com)
* [Google Apps Script](https://developers.google.com/apps-script)
* [Tanvir’s Slot Booking System](https://github.com/tan7vir/Slot-Booking-System)
* North South University


