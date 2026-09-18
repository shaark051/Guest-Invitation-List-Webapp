## 2025-09-18 - Contextual ARIA labels for inline-editable data tables
**Learning:** In spreadsheet-like data tables with inline editing, inputs and action buttons lack visual `<label>` elements, causing screen reader users to hear unhelpful generic prompts like "edit text" or "button".
**Action:** Always provide descriptive, contextual `aria-label` attributes for each table cell input, checkbox, select dropdown, and row action button including the row's entity identifier (e.g. `aria-label="Remove John Doe"` or `aria-label="RSVP status for John Doe"`).
