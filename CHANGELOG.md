# Changelog

All notable changes to Guest Ledger are documented in this file.

## [2.0.0] - 2026-09-09

### Changed
- Complete visual redesign: replaced the parchment/ledger theme (green, cream, beige) with a clean white/blue/grey system inspired by Apple's design language
- Swapped Fraunces (serif) and IBM Plex Mono for a single system font stack (`-apple-system` / SF Pro, falling back to Inter)
- Header is now a sticky, frosted-glass translucent bar instead of a solid green band with a texture overlay
- Buttons are now blue pill-shaped primary actions with grey secondary/ghost styling, matching Apple's CTA pattern
- Status pills (Accepted / Declined / Awaiting) now use Apple's system colors — green, red, orange
- Table numerals use tabular figures on the system font instead of a monospace typeface
- Logo mark redesigned as a small rounded-square app icon with a checklist glyph, replacing the wax-seal circle
- Renamed internal layout classes (`.desk` → `.app-shell`, `.page-sheet` → `.surface-panel`) to match the new visual language

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
