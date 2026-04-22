# Invoice Management App

A responsive invoice management app built with React and plain CSS, styled to match the provided Figma direction.

## Setup

1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`
3. Build for production with `npm run build`

## Architecture

- `src/App.jsx` coordinates invoice state, selection, filtering, theme persistence, and overlay visibility.
- `src/components/` contains the presentation layer for the sidebar, header, list, detail view, form drawer, and modal.
- `src/utils/invoice.js` contains formatting helpers, validation, ID generation, empty form state, and invoice normalization.
- `src/hooks/useMediaQuery.js` powers the mobile list-to-detail experience.
- `src/data/seed.js` provides starter invoices so the UI is not empty on first load.
- `src/index.css` contains the full responsive layout, theme variables, hover states, and component styling in plain CSS.

## Persistence

- Invoice data is persisted with `localStorage`
- Theme preference is also persisted with `localStorage`

## Accessibility Notes

- Semantic form controls with labels
- Buttons use native `<button>` elements
- Delete confirmation is rendered as a modal dialog
- Modal supports ESC to close and simple focus trapping
- Visible focus states are included for interactive controls

## Trade-offs

- The app uses a single top-level React file for speed of delivery; this can be split into separate component files later.
- LocalStorage was chosen over a backend to keep setup lightweight and meet the persistence requirement quickly.
- The date picker uses the browser native input for accessibility and simpler responsive behavior.

## Improvements

- Add routing for dedicated invoice detail URLs
- Add unit tests for validation and invoice workflows
- Replace seeded local data with a real API/backend
- Add richer transitions for list/detail navigation
