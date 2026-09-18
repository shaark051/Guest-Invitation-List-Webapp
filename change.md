# Changes and Fixes Log

## Summary of Recent Changes

### Accessibility Enhancements (UX)
- Added `aria-label="Event name"` to the event title input in `index.html`.
- Added `aria-label="Search guests"` to the guest search input field in `index.html`.
- Added explicit ARIA labels to the guest creation row inputs (`#new-name`, `#new-house`, `#new-contact`, `#new-notes`) in `index.html`.
- Added contextual `aria-label` attributes to dynamic table row inputs and controls in `src/js/app.js` (`name`, `house`, `contact`, `invited` checkbox, `status` select, `notes`, and icon-only `delete-btn`) including guest names or identifiers (e.g. `aria-label="RSVP status for [Name]"` and `aria-label="Remove [Name]"`).

### Deployment and Build Fixes
- Re-created `wrangler.toml` configuration file with assets directory configured (`directory = "."`) and compatibility date to resolve Cloudflare Workers build deployment failures (`guest-ledger-webapp`).
