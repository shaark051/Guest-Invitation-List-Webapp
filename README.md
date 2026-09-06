# Guest Ledger

# Access: https://guest-invitation-list-webapp.sharierarko-business.workers.dev/

A live, shared guest list for planning an event — invite tracking and RSVP
status for every guest, synced in real time, with no build step and no
server to run.

Built from a spreadsheet of 57 guests grouped by house (SJH, SMH, KJAH, SAH),
tracking contact numbers, whether an invitation was sent, and RSVP status
(Accepted / Declined / Awaiting response). This app turns that spreadsheet
into something everyone helping plan the event can open, search, and edit at
the same time — changes made on one device appear instantly on every other
one open to the page.

**Stack:** vanilla HTML, CSS, and JavaScript (ES modules, no framework, no
build step) · [Firebase](https://firebase.google.com) Firestore + Anonymous
Auth for the backend · deployed as a static site on
[Cloudflare Pages](https://pages.cloudflare.com).

## Features

- Live sync — every edit writes straight to Firestore and pushes to every
  open tab instantly (`onSnapshot`), no refresh needed.
- Inline editing — click any cell to edit a name, house, contact number, or
  note directly in the table.
- One-click toggles for "invitation sent" and a status dropdown for RSVP.
- Search by name, note, or number, and filter by house or RSVP status.
- A running tally of totals, invited, accepted, declined, and awaiting reply.
- An editable event name/title, also stored in Firestore.
- A one-time "Load starter list" button that imports the original 57 guests
  from `guests-seed.js` — safe to ignore if you're starting from scratch.

## Project structure

```
guest-list-app/
├── index.html          # page structure
├── style.css            # all styling (no CSS framework)
├── app.js                # app logic + Firestore reads/writes
├── firebase-config.js   # your Firebase project keys go here
├── guests-seed.js       # the original 57 guests, for the starter-list import
├── firestore.rules      # security rules to paste into Firebase
└── README.md
```

## 1. Set up Firebase

1. Go to the [Firebase console](https://console.firebase.google.com) and
   create a project (the free "Spark" plan is enough for this).
2. On the project overview page, click the **`</>`** (web) icon to register
   a web app. Skip Firebase Hosting when prompted — you're using Cloudflare
   Pages instead.
3. Copy the `firebaseConfig` object it shows you, and paste the values into
   `firebase-config.js` in this project.
4. In the left sidebar:
   - **Build → Firestore Database → Create database** — choose *production
     mode* and any nearby region.
   - **Build → Authentication → Sign-in method** — enable **Anonymous**.
     This lets the app quietly sign in visitors so Firestore can tell real
     app traffic from random requests, without ever showing a login screen.
5. **Build → Firestore Database → Rules** — paste in the contents of
   `firestore.rules` from this repo and click **Publish**.
   (Or, if you use the Firebase CLI: `firebase deploy --only firestore:rules`.)

## 2. Run it locally

Because the app uses ES module imports, opening `index.html` directly
(`file://`) won't work — serve it over HTTP:

```bash
cd guest-list-app
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static server works — VS Code's "Live Server" extension, `npx serve`,
etc.

## 3. Deploy to Cloudflare Pages

**Option A — connect a GitHub repo (recommended, auto-deploys on push):**

1. Push this project to a GitHub repository.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com) go to
   **Workers & Pages → Create → Pages → Connect to Git**, and select the repo.
3. Build settings:
   - Framework preset: **None**
   - Build command: *(leave blank)*
   - Build output directory: `/` (or the subfolder where `index.html` lives,
     if this isn't the repo root)
4. Click **Save and Deploy**. Cloudflare gives you a `*.pages.dev` URL, and
   redeploys automatically on every push to the branch.
5. Optional: **Custom domains** tab to attach your own domain.

**Option B — drag-and-drop, no Git needed:**

Go to **Workers & Pages → Create → Pages → Upload assets**, and drag in the
`guest-list-app` folder. Good for a quick one-off deploy.

## Tightening access

The default rules require a signed-in Firebase user, but anonymous sign-in
is open to anyone who loads the app — so this is a light gate against
random bots hitting the database directly, not a real password. For a
guest list shared only with people you trust, that's usually enough. If you
want to restrict *writing* to just the organizers:

1. Switch `signInAnonymously` in `app.js` for Google sign-in
   (`GoogleAuthProvider` + `signInWithPopup`).
2. In `firestore.rules`, restrict writes to specific accounts:

```
allow read: if request.auth != null;
allow write: if request.auth != null &&
  request.auth.token.email in ['you@example.com', 'partner@example.com'];
```

## Notes on the data

- The original spreadsheet had two blocks of rows sharing the same "Sl no."
  (38–47 appeared twice); the seed data renumbers everyone 1–57 in their
  original order so every guest has a unique number.
- Phone numbers are stored as text, not numbers, so leading zeros
  (`01732…`) are preserved.
