# DocOrchestrator — Frontend

> React + Vite frontend for AI-powered document intelligence with cinematic UI.

---

## Live App
```
https://your-app.vercel.app
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Utility styling |
| Framer Motion | Animations |
| Axios | API requests |
| react-hot-toast | Notifications |
| Lucide React | Icons |

---

## Features

- Drag and drop document upload — PDF and TXT
- AI-powered structured extraction — returns only what you ask for
- Session history — every extraction saved, click to restore
- Export PDF report — download beautifully formatted extraction report
- n8n email automation trigger — one click sends analytical alert email
- Four output panels — extracted data, analytical answer, email body, automation status
- Aurora canvas background — WebGL-style animated orbs responding to mouse
- Magnetic buttons — physically follow the cursor
- Custom cursor — dot and ring with spring physics
- Ticker tape — scrolling feature list
- Character-by-character hero animation
- Holographic card borders on hover

---

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── UploadSection.jsx    File upload + question input + magnetic button
│   │   ├── ResultsPanel.jsx     Extracted data table + PDF export
│   │   ├── EmailPanel.jsx       Email input + n8n trigger + four outputs
│   │   ├── HistoryPanel.jsx     Session history with restore
│   │   └── Loader.jsx           Animated loading with step timeline
│   ├── App.jsx                  Root — aurora canvas, cursor, ticker, layout
│   ├── main.jsx                 React entry point
│   └── index.css                Global styles + CSS variables + animations
├── index.html                   Fonts — Bebas Neue + DM Mono + Outfit
├── vite.config.js               Vite config + dev proxy
├── tailwind.config.js           Custom colors + fonts
├── postcss.config.js            PostCSS + autoprefixer
├── vercel.json                  Vercel deployment config
└── .env                         VITE_API_URL
```

---

## Environment Variables

Create a `.env` file in the client root:
```env
VITE_API_URL=http://localhost:5000
```

In production on Vercel set:
```env
VITE_API_URL=https://your-render-backend.onrender.com
```

---

## Four Output Panels

| Panel | Description |
|---|---|
| Structured Data | Key-value pairs extracted by Groq AI |
| Final Analytical Answer | AI-generated insight from n8n |
| Generated Email Body | The drafted alert email content |
| Automation Status | Whether the email was sent or failed |

---

## Local Development
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

Make sure the backend is running at `http://localhost:5000` simultaneously.

---

## Deployment on Vercel

1. Push this folder to a GitHub repository
2. Go to vercel.com → New Project → Import repository
3. Framework: Vite
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
5. Click Deploy

Or use the included `vercel.json` which sets the environment variable automatically.

---

## New Features Added

### Session History
Every document you analyse during a session is saved to a history panel below the upload card. Click any past entry to instantly restore its extracted data and results. Stores up to 8 entries. Has a clear button.

### Export PDF Report
After extraction, click the Export PDF button in the results panel. A beautifully formatted dark-themed report opens in a new browser tab with your extracted data, query, and AI summary. Use the browser print dialog to save as PDF.

---

## Security

- Backend URL stored in `.env` — never hardcoded
- No API keys ever exposed to the browser
- All sensitive operations handled server-side
