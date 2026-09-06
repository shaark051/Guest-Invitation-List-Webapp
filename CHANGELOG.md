# Changelog

All notable changes to Guest Ledger are documented in this file.

## [1.1.0] - 2026-09-06

### Added
- Empty-state hero screen shown when the ledger has zero guests, with "Load starter list" and "Add a guest manually" actions
- "+ Add guest" button in the toolbar that jumps straight to the add-row
- Trash icon for the delete action (replacing the plain "✕")
- Wax-seal accent mark next to the header title

### Changed
- Page layout now renders as a lifted paper sheet on a desk background, replacing the flat single-tone page
- Header has a subtle woven-texture overlay
- Buttons, inputs, and status pills restyled for a more consistent, polished finish
- Ledger content now fades in once guests are loaded, instead of appearing instantly

### Fixed
- Removed the awkward state where an empty table (header + add-row only) showed underneath the "load starter list" banner

## [1.0.0] - 2026-09-06

### Added
- Initial release — vanilla HTML/CSS/JS guest list app, no build step, no framework
- Firebase Firestore backend with live sync (`onSnapshot`) across every open tab
- Anonymous Firebase Auth as a lightweight gate on reads/writes
- Inline editing for name, house, contact number, and notes directly in the table
- "Invitation sent" checkbox and an RSVP status dropdown (Accepted / Declined / Awaiting response)
- Search by name/note/number, plus filters by house and RSVP status
- Running tally of total, invited, accepted, declined, and awaiting-reply counts
- Editable event title, stored in Firestore and synced live
- One-time "Load starter list" import of the original 57-guest spreadsheet
- Firestore security rules (`firestore.rules`) and a full Cloudflare Pages deployment guide in `README.md`
