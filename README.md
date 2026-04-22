# Invoice Web App

A responsive invoice management app built with React and Vite. It supports invoice listing, filtering, detail viewing, creation, editing, deletion, marking invoices as paid, theme switching, and local persistence.

## Setup Instructions

### Requirements

- Node.js 18+ recommended
- npm 9+ recommended

### Install and run

```bash
npm install
npm run dev
```

The Vite dev server will print a local URL, typically `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview
```

## Architecture Explanation

The app uses a simple client-side architecture with one stateful shell component and focused presentational components.

### High-level flow

- `src/main.jsx` boots the React app.
- `src/App.jsx` is the application orchestrator. It owns invoice data, current selection, filter state, mobile page state, theme preference, and overlay visibility.
- `src/components/` contains UI building blocks for the sidebar, list, header, details page, invoice form drawer, and confirmation modal.
- `src/utils/invoice.js` contains domain logic such as currency/date formatting, payment due-date calculation, ID generation, invoice normalization, and validation.
- `src/data/seed.js` provides initial invoice data when there is nothing in `localStorage`.
- `src/hooks/useMediaQuery.js` enables the mobile-specific list/detail navigation pattern.
- `src/index.css` contains the full styling layer, including theme tokens, responsive layout rules, and component states.

### State and persistence

- Invoice records are loaded from `localStorage` first, with seeded data as the fallback.
- Theme preference is persisted separately in `localStorage`.
- Creating or editing an invoice runs through normalization before saving so numeric fields and payment due dates stay consistent.
- On smaller screens, the app behaves like a two-step flow: list first, then detail view after selection.

### Component responsibilities

- `Header` handles invoice count, status filtering, and the create action.
- `InvoiceList` renders the empty state and invoice cards.
- `InvoiceDetails` renders the full invoice summary and actions.
- `InvoiceForm` owns the editable draft state for invoice creation and editing, including line-item management and validation feedback.
- `Modal` and `ConfirmModal` handle destructive-action confirmation.
- `Sidebar` handles branding and theme toggling.

## Trade-offs

- `App.jsx` centralizes most state for speed and simplicity. That keeps the data flow easy to trace, but it also means some responsibilities are concentrated in one file instead of being split into reducers, context, or feature modules.
- `localStorage` keeps setup lightweight and avoids backend complexity, but it is single-device only and offers no sync, auth, or multi-user support.
- Validation is done on the client and mainly at submit time. This keeps the form implementation small, but it is not as robust as a schema-driven approach with richer inline feedback.
- Styling is plain CSS rather than a component library or CSS-in-JS. That keeps runtime overhead low and makes the output portable, but larger teams may prefer stronger scoping conventions as the app grows.
- Native date and form controls improve browser support and accessibility basics, but visual consistency can vary across devices.

## Accessibility Notes

### What is already in place

- Native form controls are used with visible labels.
- Interactive actions use real `button` elements.
- Focus-visible styles are defined for buttons, inputs, and selects.
- The delete confirmation uses `role="dialog"` and `aria-modal="true"`.
- The confirmation modal supports `Escape` to close and includes simple focus trapping.
- The empty state announces changes with `aria-live="polite"`.
- Theme state is reflected visually without removing browser focus indicators.

### Current limitations

- The invoice form drawer behaves like a dialog visually, but it is not exposed as a proper modal dialog with `role="dialog"` and managed focus.
- The status filter is styled like a custom popup, but it does not implement full keyboard listbox behavior.
- Error messages are visible, but inputs are not linked to those messages with `aria-describedby`, and invalid fields do not set `aria-invalid`.
- There is no reduced-motion handling for the drawer and modal animations yet.

## Improvements Beyond Requirements

- Added theme persistence, including light and dark mode support.
- Added seeded starter data so the interface is useful immediately on first load.
- Added mobile-specific navigation behavior rather than forcing desktop layout onto small screens.
- Added draft saving and pending/paid workflow support.
- Added a reusable modal abstraction for destructive confirmation.
- Added invoice normalization helpers so saved data stays structurally consistent.

## Suggested Next Improvements

- Add tests for validation, invoice mutations, and key mobile flows.
- Improve accessibility for the form drawer and filter menu.
- Add URL-based routing so invoice details can be shared directly.
- Introduce a reducer or state machine if invoice workflows become more complex.
- Replace `localStorage` with a real API if persistence needs to survive across devices or users.
