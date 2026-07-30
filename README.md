# CampusIQ — AI Smart Campus Navigator
Live Demo : https://campus-iq-ai-smart-campus-navigator.onrender.com/
**Find Anyone. Find Anywhere. Instantly.**

A high-fidelity frontend prototype of an AI-powered campus navigation system, built for students, professors, parents/visitors, campus staff, administrators, and examination controllers.

## Tech stack

- React 18 + Vite (JavaScript, no TypeScript)
- Tailwind CSS (custom design tokens — see `tailwind.config.js`)
- React Router DOM
- Framer Motion
- Lucide React icons
- 100% mock JSON data — no backend required

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## What's inside

| Area | Where |
|---|---|
| Mock data (professors, buildings, departments, events, exams, notifications, roles) | `src/data/*.json` |
| Global state (role, theme, live professor/building status, notifications) | `src/context/AppContext.jsx` |
| Universal AI search engine (category detection, LLM-swap-ready) | `src/services/aiSearchService.js` |
| AI Campus Assistant (rule-based chat, LLM-swap-ready) | `src/services/chatService.js` |
| Voice search (browser Speech Recognition API) | `src/hooks/useSpeechRecognition.js` |
| Interactive campus map with animated routes | `src/components/CampusMapView.jsx` |
| Page-level screens | `src/pages/*.jsx` |

## Key flows to try

1. **Landing → Select a role** (e.g. Student) → arrives on Home.
2. **Universal search** — try "Dr Amit Sharma", "Library", "Placement Cell", "IT Department", or tap the mic to search by voice.
3. **Faculty Locator** — open a professor's profile to see live availability, cabin, office hours, and a "Navigate" button that opens the map.
4. **Professor role** — from Home, open the Availability Dashboard, change a professor's status (e.g. to "Meeting"), and see it reflected instantly across the app (search results, profile, map panel, notifications).
5. **Smart Campus Map** — tap any building to see live open/limited/restricted/closed status, departments, and faculty. A route line animates in from the Main Gate.
6. **Exam Center Finder** — search a roll number (try `CS2101`) or name to see exam room, seat, and walking time.
7. **Examination Controller role** — import a CSV (any file with a header row works), add a student manually, or restrict a building — the campus map updates automatically everywhere.
8. **AI Campus Assistant** — the floating button in the bottom-right corner. Try "Where is Dr Sharma?", "Take me to Library", "Can I visit Engineering Block?".
9. **Settings** — toggle dark mode, accessibility mode, large text, and language (English/Hindi label toggle).

## Notes

- State (role, theme, live statuses, notifications) persists to `localStorage` under the key `campusiq_state_v1` so changes survive a page refresh. Clear your browser storage to reset the demo.
- Voice search requires a Chromium-based browser (uses the Web Speech API); it gracefully hides itself where unsupported.
- The AI search and AI assistant are intentionally isolated in `src/services/` so a real LLM or vector-search backend can be dropped in later without touching any UI code.
