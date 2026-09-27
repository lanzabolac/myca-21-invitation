/* ==========================================
   ✨ CUSTOMIZE YOUR INVITATION HERE
   ========================================== */
const eventData = {
  celebrantName: "KEITH LYN",
  nickname: "Keith Lyn",
  age: 23,
  quote: "Stepping into a new chapter, surrounded by the people I love.",

  eventDate: "November 09, 2026",
  eventDateTime: "2026-11-09T17:00:00", // used by the countdown
  eventTime: "5:00 PM",

  venue: "Example Grand Ballroom",
  venueAddress: "Mateo Street, Malamig, Bustos, Bulacan, Philippines",
  mapLink: "", // paste a Google Maps link, or leave "" to search the venue

  theme: "lavender", // color preset: "", "rose", "sage", "lavender", "midnight" (or edit style.css)

  music: "music/enchanted.mp3", // your song file; use "" to remove the music button
  musicAutoplay: true, // starts when the guest taps "Open Invitation"

  heroImage: "images/hero.jpg",
  portraitImage: "images/portrait.jpg",
  galleryImages: [
    // add or remove lines to change the gallery
    "images/gallery-01.jpg",
    "images/gallery-02.jpg",
    "images/gallery-03.jpg",
    "images/gallery-04.jpg",
    "images/gallery-05.jpg",
    "images/gallery-06.jpg",
    "images/gallery-07.jpg",
    "images/gallery-08.jpg",
  ],

  dressCode: "Formal Attire",
  ladies: "Elegant dresses / gowns",
  gentlemen: "Suit / formal wear",

  traditions: [
    {
      n: "23",
      t: "Roses",
      d: "Eighteen special people share a dance and a rose.",
    },
    {
      n: "23",
      t: "Candles",
      d: "Eighteen loved ones light a candle with a heartfelt wish.",
    },
    {
      n: "23",
      t: "Treasures",
      d: "Eighteen keepsakes and words of wisdom for the journey.",
    },
    {
      n: "23",
      t: "Special Moments",
      d: "Cherished memories, toasts and messages from the heart.",
    },
  ],

  rsvpDeadline: "2026-11-09T23:59:59", // e.g. "2026-12-10T23:59:59" or null for no deadline
  personalization: true, // enables index.html?guest=Name
};

const rsvpConfig = {
  enabled: true,
  maxGuests: 5,
  requireEmail: false,
  requireContactNumber: false,

  endpoint: null,

  confirmationMessage: "Your RSVP has been recorded.",
};

// const rsvpConfig = {
//   enabled: true,
//   maxGuests: 5,
//   requireEmail: false,
//   requireContactNumber: false,
//   // ✨ CHANGE THIS FOR EACH CLIENT
//   recipientEmail: "abolaclanzpaulo@gmail.com",

//   endpoint: "/api/rsvp",
//   confirmationMessage: "Your RSVP has been recorded.",
// };

const adminConfig = { enabled: false }; // demo summary table. NOT secure authentication.

/* ==========================================
   HELPERS
   ========================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
};
const cap = (s) => s.charAt(0) + s.slice(1).toLowerCase();
const pad = (n) => String(n).padStart(2, "0");

// Builds an <img>; if the file is missing, swaps in a tasteful placeholder.
function photo(src, label, alt) {
  const img = new Image();
  img.alt = alt;
  img.src = src;
  img.loading = "lazy";
  img.onerror = () => {
    const p = el("div", "ph");
    p.setAttribute("role", "img");
    p.setAttribute("aria-label", alt);
    p.append(el("b", "", label), el("small", "", "Replace with your image"));
    img.replaceWith(p);
  };
  return img;
}

/* ==========================================
   EVENT CONTENT
   ========================================== */
function initializeEvent() {
  const name = cap(eventData.celebrantName);
  const d = {
    ...eventData,
    nameCap: name,
    ageTh: eventData.age + "th",
    year: new Date(eventData.eventDateTime).getFullYear(),
  };
  $$("[data-bind]").forEach((n) => {
    n.textContent = d[n.dataset.bind] ?? "";
  });
  document.title = `${name}'s ${d.ageTh} Birthday`;
  if (eventData.theme) document.documentElement.dataset.theme = eventData.theme;

  $("#cover").style.backgroundImage = `url("${eventData.heroImage}")`;
  $("#portrait").append(
    photo(eventData.portraitImage, "PORTRAIT", `Portrait of ${name}`),
  );

  eventData.traditions.forEach((t) => {
    const c = el("article", "card rv");
    c.append(el("div", "n", t.n), el("h3", "", t.t), el("p", "", t.d));
    $("#trad").append(c);
  });

  const q = encodeURIComponent(`${eventData.venue}, ${eventData.venueAddress}`);
  const map = el("iframe");
  map.src = `https://www.google.com/maps?q=${q}&output=embed`;
  map.title = "Map of the venue";
  map.loading = "lazy";
  $("#map").append(map);
  $("#map-btn").href =
    eventData.mapLink || `https://www.google.com/maps/search/?api=1&query=${q}`;
}

// Personalized greeting: index.html?guest=Lanz (textContent keeps it safe from HTML injection)
function initializeGreeting() {
  const guest =
    eventData.personalization &&
    new URLSearchParams(location.search).get("guest");
  const name = cap(eventData.celebrantName);
  if (guest && guest.trim()) {
    $("#greet-kicker").textContent =
      "WELCOME, " + guest.trim().slice(0, 40).toUpperCase();
    $("#greet-sub").textContent =
      `We are so happy to invite you to celebrate ${name}'s ${eventData.age}th birthday.`;
  } else {
    $("#greet-sub").textContent =
      "A celebration of love, life, and new beginnings.";
  }
}

function initializeCover() {
  $("#open-btn").onclick = () => {
    const c = $("#cover");
    c.classList.add("open");
    document.body.classList.remove("locked");
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => c.classList.add("gone"), 1300);
  };
}

// Background music: floating play/pause button. Hidden if the file is missing.
function initializeMusic() {
  const btn = $("#music-btn"),
    audio = $("#bgm");
  if (!eventData.music) return;
  audio.src = eventData.music;
  audio.onerror = () => {
    btn.hidden = true;
  };
  btn.hidden = false;
  const set = (on) => {
    btn.classList.toggle("playing", on);
    btn.setAttribute("aria-pressed", on);
    btn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  };
  const play = () =>
    audio
      .play()
      .then(() => set(true))
      .catch(() => set(false));
  btn.onclick = () => {
    if (audio.paused) play();
    else {
      audio.pause();
      set(false);
    }
  };
  $("#open-btn").addEventListener("click", () => {
    if (eventData.musicAutoplay) play();
  });
}

/* ==========================================
   GALLERY + LIGHTBOX
   ========================================== */
const layout = ["big", "", "tall", "", "wide", "", "tall", ""];

function initializeGallery() {
  eventData.galleryImages.forEach((src, i) => {
    const b = el("button", `gi rv ${layout[i % layout.length]}`);
    b.type = "button";
    b.setAttribute("aria-label", `Open photo ${i + 1}`);
    b.style.transitionDelay = (i % 4) * 80 + "ms";
    b.append(
      photo(
        src,
        "PHOTO " + pad(i + 1),
        `${cap(eventData.celebrantName)} photo ${i + 1}`,
      ),
    );
    $("#grid").append(b);
  });
}

function initializeLightbox() {
  const lb = $("#lb"),
    body = $("#lb-body"),
    imgs = eventData.galleryImages;
  let cur = 0,
    opener = null;
  const show = () =>
    body.replaceChildren(
      photo(
        imgs[cur],
        "PHOTO " + pad(cur + 1),
        `Photo ${cur + 1} of ${imgs.length}`,
      ),
    );
  const step = (d) => {
    cur = (cur + d + imgs.length) % imgs.length;
    show();
  };
  const close = () => {
    lb.classList.remove("on");
    if (opener) opener.focus();
  };
  $("#grid").onclick = (e) => {
    const b = e.target.closest(".gi");
    if (!b) return;
    cur = $$(".gi").indexOf(b);
    opener = b;
    show();
    lb.classList.add("on");
    $("#lb-close").focus();
  };
  $("#lb-close").onclick = close;
  $("#lb-prev").onclick = () => step(-1);
  $("#lb-next").onclick = () => step(1);
  lb.onclick = (e) => {
    if (e.target === lb || e.target === body) close();
  };
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
}

/* ==========================================
   COUNTDOWN + NAVIGATION + ANIMATIONS
   ========================================== */
function initializeCountdown() {
  const target = new Date(eventData.eventDateTime).getTime();
  const tick = () => {
    const s = Math.floor((target - Date.now()) / 1000);
    if (!(s > 0)) {
      $("#cd-grid").hidden = true;
      $("#cd-done").hidden = false;
      return false;
    }
    const v = {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60,
    };
    for (const k in v) $("#cd-" + k).textContent = pad(v[k]);
    return true;
  };
  if (tick()) {
    const id = setInterval(() => tick() || clearInterval(id), 1000);
  }
}

function initializeNavigation() {
  const burger = $("#burger"),
    menu = $("#menu");
  const set = (open) => {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  };
  burger.onclick = () => set(!menu.classList.contains("open"));
  menu.onclick = (e) => {
    if (e.target.tagName === "A") set(false);
  };
}

function initializeAnimations() {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  $$(".rv").forEach((n) => io.observe(n));
}

/* ==========================================
   RSVP (localStorage demo, optional endpoint)
   ========================================== */
const RSVP_KEY = "debutRSVPs";
const getRSVPs = () => {
  try {
    return JSON.parse(localStorage.getItem(RSVP_KEY)) || [];
  } catch {
    return [];
  }
};
const saveRSVP = (g) => {
  const list = getRSVPs();
  list.push(g);
  localStorage.setItem(RSVP_KEY, JSON.stringify(list));
};
const clearRSVPs = () => localStorage.removeItem(RSVP_KEY);

const showErr = (key, msg) => {
  const s = $("#err-" + key);
  s.textContent = msg || "";
  s.classList.toggle("show", !!msg);
  return !msg;
};

function validate(g) {
  let ok = true;
  ok = showErr("name", g.name ? "" : "Please enter your name.") && ok;
  const mailBad = g.email
    ? !/^\S+@\S+\.\S+$/.test(g.email)
    : rsvpConfig.requireEmail;
  ok =
    showErr("email", mailBad ? "Please enter a valid email address." : "") &&
    ok;
  const telBad = g.contact
    ? !/^[\d\s+()-]{7,20}$/.test(g.contact)
    : rsvpConfig.requireContactNumber;
  ok =
    showErr("contact", telBad ? "Please enter a valid contact number." : "") &&
    ok;
  ok =
    showErr("att", g.attendance ? "" : "Please select your attendance.") && ok;
  return ok;
}

function celebrate() {
  for (let i = 0; i < 22; i++) {
    const h = el("span", "heart", "♡");
    h.style.cssText = `left:${Math.random() * 100}vw;font-size:${12 + Math.random() * 16}px;animation-delay:${Math.random() * 1.2}s`;
    document.body.append(h);
    setTimeout(() => h.remove(), 5000);
  }
}

function initializeRSVP() {
  const form = $("#rsvp-form"),
    gc = $("#gc"),
    modal = $("#modal"),
    max = rsvpConfig.maxGuests;
  const deadline = eventData.rsvpDeadline;
  if (!rsvpConfig.enabled || (deadline && Date.now() > new Date(deadline))) {
    form.hidden = true;
    $("#rsvp-closed").hidden = false;
    if (!rsvpConfig.enabled)
      $("#closed-msg").textContent = "RSVP is not available right now.";
    return;
  }
  gc.max = max;
  const clamp = (v) => Math.min(max, Math.max(1, parseInt(v, 10) || 1));
  $("#minus").onclick = () => {
    gc.value = clamp(+gc.value - 1);
  };
  $("#plus").onclick = () => {
    gc.value = clamp(+gc.value + 1);
  };
  gc.onchange = () => {
    gc.value = clamp(gc.value);
  };

  const closeModal = () => modal.classList.remove("on");
  $("#m-close").onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  form.onsubmit = async (e) => {
    e.preventDefault();
    const g = {
      name: $("#name").value.trim(),
      email: $("#email").value.trim(),
      contact: $("#contact").value.trim(),
      guestCount: clamp(gc.value),
      attendance: form.att.value,
      message: $("#msg").value.trim(),
      submittedAt: new Date().toISOString(),
    };
    if (!validate(g)) return;
    const btn = form.querySelector("[type=submit]");
    btn.disabled = true;
    try {
      await emailjs.send("service_re6haon", "template_esa8mnl", {
        name: g.name,
        email: g.email,
        contact: g.contact,
        guests: g.guestCount,
        attendance: g.attendance,
        message: g.message,
      });

      saveRSVP(g);
    } catch {
      showErr("form", "We couldn't save your RSVP. Please try again.");
      btn.disabled = false;
      return;
    }
    showErr("form", "");
    const yes = g.attendance === "attending";
    $("#m-title").textContent = yes
      ? `Thank you, ${g.name.split(/\s+/)[0]}!`
      : "Thank you for letting us know";
    $("#m-text").textContent = yes
      ? `${rsvpConfig.confirmationMessage} We look forward to celebrating this special milestone with you.`
      : "We're sorry you won't be able to join us, but we truly appreciate your response.";
    $("#m-close").textContent = yes ? "See you there" : "Close";
    form.hidden = true;
    $("#rsvp-done").textContent = rsvpConfig.endpoint
      ? "Your response has been sent ♡"
      : "Demo mode: your response is saved in this browser only ♡";
    $("#rsvp-done").hidden = false;
    modal.classList.add("on");
    $("#m-close").focus();
    if (yes) celebrate();
    $("#rsvp").scrollIntoView({ behavior: "smooth" });
  };
}

/* ==========================================
   ADMIN SUMMARY (demo only)
   ========================================== */
function initializeAdmin() {
  if (!adminConfig.enabled) return;
  $("#admin").hidden = false;
  const render = () => {
    const list = getRSVPs(),
      yes = list.filter((r) => r.attendance === "attending");
    $("#sum").textContent =
      `Total responses: ${list.length} · Attending: ${yes.length} · Not attending: ${list.length - yes.length} · Guests attending: ${yes.reduce((a, r) => a + r.guestCount, 0)}`;
    $("#rows").replaceChildren(
      ...list.map((r) => {
        const tr = el("tr");
        [
          r.name,
          r.guestCount,
          r.attendance === "attending" ? "Attending" : "Not attending",
          r.message || "—",
        ].forEach((v) => tr.append(el("td", "", String(v))));
        return tr;
      }),
    );
  };
  render();
  $("#csv").onclick = () => {
    const cols = [
      "name",
      "email",
      "contact",
      "guestCount",
      "attendance",
      "message",
      "submittedAt",
    ];
    const cell = (v) => {
      v = String(v ?? "");
      if (/^[=+\-@]/.test(v)) v = "'" + v;
      return '"' + v.replace(/"/g, '""') + '"';
    };
    const csv = [cols.join(",")]
      .concat(getRSVPs().map((r) => cols.map((k) => cell(r[k])).join(",")))
      .join("\n");
    const a = el("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "rsvps.csv";
    a.click();
  };
  $("#clear").onclick = () => {
    if (confirm("Delete all RSVPs saved in this browser?")) {
      clearRSVPs();
      render();
    }
  };
}

/* ==========================================
   START
   ========================================== */
initializeEvent();
initializeGreeting();
initializeCover();
initializeMusic();
initializeGallery();
initializeCountdown();
initializeNavigation();
initializeLightbox();
initializeRSVP();
initializeAdmin();
initializeAnimations();
