/* ============================================================
   PHASE 2 — script.js
   Only the hero's music toggle lives here for now (FR-08).
   Countdown, schedule reveal, RSVP logic etc. will be added in
   their own clearly-commented sections as each phase is built —
   keeping the file easy to follow while we learn/build it.
   ============================================================ */

/* ============================================================
   CONFIG — centralized wedding details.
   Edit this ONE object to personalize the whole invitation
   (currently only the countdown reads from it — as the rest of
   the site is wired up in later phases, more of the hardcoded
   text in index.html will move here too).
   ============================================================ */
const CONFIG = {
  coupleNames: { partner1: "Layal", partner2: "Karim" },
  weddingDateISO: "2027-06-12T17:00:00", // Friday, June 12 2027, 5:00 PM — edit here
  venueName: "Villa Chanaa"
};

/* ============================================================
   OPENING — envelope lock screen
   Tapping the envelope/seal plays the flap-open animation, then
   unlocks scrolling and reveals the hero underneath.
   ============================================================ */
(function envelopeOpen(){
  const opening = document.getElementById('opening');
  const btn = document.getElementById('envelope-btn');
  const bottomNav = document.getElementById('bottom-nav');
  if(!opening || !btn) return;

  btn.addEventListener('click', () => {
    opening.classList.add('is-opening');
    document.body.classList.remove('lock');
    if(bottomNav) bottomNav.classList.add('is-ready');
    window.setTimeout(() => opening.classList.add('is-open'), 700);
  });
})();

/* ============================================================
   Bottom nav — scroll-spy
   Highlights whichever section is currently in view.
   ============================================================ */
(function bottomNavSpy(){
  const links = document.querySelectorAll('#bottom-nav a[data-nav]');
  if(!links.length) return;
  const sections = Array.from(links)
    .map(link => document.getElementById(link.dataset.nav))
    .filter(Boolean);
  if(!sections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.id;
        links.forEach(link => link.classList.toggle('is-active', link.dataset.nav === id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => io.observe(section));
})();

/* ============================================================
   PHASE 3 — scroll reveal
   Generic utility: any element with class "reveal-on-scroll"
   fades/lifts in once it enters the viewport. Reused by every
   section from here on (details, schedule, RSVP, etc.).
   ============================================================ */
(function scrollReveal(){
  const els = document.querySelectorAll('.reveal-on-scroll');
  if(!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  els.forEach(el => io.observe(el));
})();

/* ============================================================
   PHASE 4 — countdown
   Calculates and updates remaining days/hours/minutes/seconds
   every second. Handles a past date safely by showing a calm
   post-wedding message instead of negative numbers (FR-04).
   ============================================================ */
(function countdown(){
  const targetTime = new Date(CONFIG.weddingDateISO).getTime();
  const grid = document.getElementById('countdown-grid');
  const passedMsg = document.getElementById('countdown-passed');
  if(!grid) return;

  const els = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-mins'),
    s: document.getElementById('cd-secs')
  };
  const pad = (n) => String(n).padStart(2, '0');

  function tick(){
    const diff = targetTime - Date.now();
    if(diff <= 0){
      grid.hidden = true;
      passedMsg.hidden = false;
      clearInterval(timer);
      return;
    }
    els.d.textContent = pad(Math.floor(diff / 86400000));
    els.h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    els.m.textContent = pad(Math.floor((diff % 3600000) / 60000));
    els.s.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  const timer = setInterval(tick, 1000);
})();

(function musicToggle(){
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-audio');
  if(!btn || !audio) return;

  btn.addEventListener('click', () => {
    const playing = btn.getAttribute('aria-pressed') === 'true';
    if(playing){
      audio.pause();
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Play background music');
    }else{
      // Only plays because the guest tapped the button — never autoplays.
      audio.play().catch(() => { /* file missing or blocked — safe to ignore */ });
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', 'Pause background music');
    }
  });
})();

/* ============================================================
   PHASE 5 — venue directions
   Builds a Google Maps search link from CONFIG so the address
   never has to be typed twice.
   ============================================================ */
(function venueDirections(){
  const link = document.getElementById('directions-link');
  if(!link) return;
  const query = encodeURIComponent(CONFIG.venueName + ', Beit Mery, Mount Lebanon');
  link.href = 'https://www.google.com/maps/search/?api=1&query=' + query;
})();

/* ============================================================
   PHASE 6 — RSVP
   Simple state machine: initial → attending/declining → submitting
   → success, with inline validation (FR-07).
   ============================================================ */
(function rsvp(){
  const form = document.getElementById('rsvp-form');
  if(!form) return;

  const nameInput = document.getElementById('rsvp-name');
  const nameField = document.getElementById('name-field');
  const attendanceField = document.getElementById('attendance-field');
  const guestField = document.getElementById('guest-count-field');
  const submitBtn = document.getElementById('rsvp-submit');
  const submitText = document.getElementById('rsvp-submit-text');
  const successPanel = document.getElementById('rsvp-success');
  const successMsg = document.getElementById('rsvp-success-msg');

  form.querySelectorAll('input[name="attendance"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const attending = form.querySelector('input[name="attendance"]:checked')?.value === 'yes';
      guestField.classList.toggle('is-shown', attending);
      attendanceField.classList.remove('has-error');
      if(!attending){
        form.querySelectorAll('input[name="guests"]').forEach(g => g.checked = false);
        guestField.classList.remove('has-error');
      }
    });
  });

  nameInput.addEventListener('input', () => nameField.classList.remove('has-error'));
  form.querySelectorAll('input[name="guests"]').forEach(g =>
    g.addEventListener('change', () => guestField.classList.remove('has-error'))
  );

  function validate(){
    let valid = true;
    const name = nameInput.value.trim();
    const attendance = form.querySelector('input[name="attendance"]:checked');
    const guests = form.querySelector('input[name="guests"]:checked');

    nameField.classList.toggle('has-error', name.length === 0);
    if(name.length === 0) valid = false;

    attendanceField.classList.toggle('has-error', !attendance);
    if(!attendance) valid = false;

    if(attendance && attendance.value === 'yes'){
      guestField.classList.toggle('has-error', !guests);
      if(!guests) valid = false;
    }
    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!validate()) return;

    const attendance = form.querySelector('input[name="attendance"]:checked').value;

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    submitText.textContent = 'Sending';

    // NOTE: this is a frontend-only prototype (per FR-07 for V1).
    // To actually collect responses, replace this setTimeout with a
    // real request — e.g. a Formspree/Google Form endpoint, or your
    // own backend — then call showSuccess() from its .then().
    window.setTimeout(() => showSuccess(attendance), 900);
  });

  function showSuccess(attendance){
    form.classList.add('is-hidden');
    successPanel.classList.add('is-shown');
    successMsg.textContent = attendance === 'yes'
      ? "We can't wait to celebrate with you on June 12, 2027."
      : "We'll miss you — thank you for letting us know.";
    successPanel.setAttribute('tabindex', '-1');
    successPanel.focus();
  }
})();
