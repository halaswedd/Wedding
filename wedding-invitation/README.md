# wedding-invitation

Digital wedding invitation — built phase by phase.

## Structure
```
wedding-invitation/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── images/   ← drop hero/venue photos here
│   ├── audio/     ← drop background song here (song.mp3)
│   └── fonts/     ← only needed if not using Google Fonts
└── README.md
```

## How to preview
Just double-click `index.html` (or open it in your browser). No build step, no server needed.

## Progress
- [x] Phase 0 — project setup
- [x] Phase 1 — palette + typography chosen
- [x] Phase 2 — hero / opening screen
- [x] Phase 3 — invitation card
- [x] Phase 4 — countdown + wedding details
- [x] Phase 5 — schedule + venue
- [x] Phase 6 — RSVP (frontend prototype — see note in script.js)
- [x] Phase 7 — motion polish (scroll reveals, hero choreography, transitions)
- [ ] Phase 8 — responsive testing (test on your own devices before sending!)
- [ ] Phase 9 — deployment

## Config to personalize
Open `js/script.js` and edit the `CONFIG` object at the top — couple
names and wedding date/time live there. Venue name, address, schedule
items and wording are currently written directly in `index.html`;
search for "Villa Chanaa" / "Beit Mery" and the schedule list to
swap in the real details.

## Hero photo
The arch window photo you sent is at `assets/images/hero-arch.jpg`,
already set as the hero background. Swap that file (same filename)
for any other photo and it updates automatically — no code changes.

## Music
Your track is at `assets/audio/song.mp3`, already wired to the
music-note button in the top-right of the hero. It never autoplays —
guests tap to start it.

## RSVP — important
The RSVP form currently only *simulates* submitting (a short delay,
then the thank-you screen). It does not save responses anywhere yet.
To actually collect RSVPs, the simplest options are:
- **Formspree** (formspree.io) — free, no backend needed, a few
  lines swapped into the submit handler in `script.js`.
- **Google Form** embedded or linked from the RSVP button.
- A real backend (PHP/MySQL or similar) if you want full control.
Ask if you'd like this wired up — it's a quick addition.

## Deploying so guests can open the link
Easiest free options, no coding needed:
1. **Netlify Drop** — go to app.netlify.com/drop, drag the whole
   `wedding-invitation` folder in, get a live link instantly.
2. **Vercel** — similar drag-and-drop flow via vercel.com.
3. GitHub Pages if you already use GitHub.
Once deployed, that's the link you share on WhatsApp/Instagram.
