# Job Tracker Extension
https://job-tracker-extension-sand.vercel.app/
Job Tracker Extension is a React + TypeScript demo project for tracking job applications in a clean dashboard UI.

The current version focuses on the product experience and demo flow:
- loading screen
- login screen
- interactive dashboard
- manual job entry form
- editable job cards
- status management
- filters
- reminders for upcoming hiring steps

## Preview

This project is currently a demo build prepared for presentation and further development.

Main ideas behind the demo:
- clear overview of submitted applications
- fast manual adding and editing of offers
- visual status tracking
- a polished UI that can later be connected to real persistence and authentication

## Tech Stack

- React
- TypeScript
- Vite
- CSS

## Project Structure

```text
src/
  background/
  content/
  popup/
    Dashboard.tsx
    Dashboard.css
    Loading.tsx
    LoginForm.tsx
    Popup.tsx
  utils/
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Current Features

- demo login flow
- dashboard with application cards
- custom dropdowns
- add new offer form
- edit existing offer from card
- delete confirmation
- salary range fields with currency and contract type
- work mode tags: remote / hybrid / onsite
- next-step date and reminder strip
- status filtering, portal filtering, contract filtering

## Planned Next Steps

- local storage for demo persistence
- real authentication
- browser extension wiring
- backend integration
- analytics and reporting

## Notes

- `node_modules`, build output and `.env` files are ignored by Git
- this repository is safe to publish after checking that no secrets were added manually
- before sharing publicly, it is worth adding screenshots to this README

## Author

Created by Dominik Skutecki.
