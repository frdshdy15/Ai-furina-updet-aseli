"use strict";

/* =====================================================
   FURINA — TRIAL OF TRUST
   CORE ENGINE — PART 1
   STABLE / NO ERROR / READY TO EXPAND
   by Firdaus Hidayatullah
===================================================== */

/* =========================
   DOM ELEMENTS
========================= */
const screenLoading = document.getElementById("loading");
const screenWelcome = document.getElementById("welcome");
const screenApp     = document.getElementById("app");
const screenEnding  = document.getElementById("ending");

const startBtn      = document.getElementById("startBtn");
const usernameInput = document.getElementById("usernameInput");

const chatBox   = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn   = document.getElementById("sendBtn");

const trustEl = document.getElementById("trust");
const scoreEl = document.getElementById("score");
const flagEl  = document.getElementById("flagValue");

/* =========================
   GLOBAL GAME STATE
========================= */
const GAME = {
  user: {
    name: "",
    messageCount: 0,
    lastMessageTime: 0
  },

  emotion: {
    trust: 0,        // -100 s/d 100
    mood: 0,         // dingin ↔ hangat
    patience: 100    // habis = cuek total
  },

  score: 0,

  system: {
    started: false,
    ended: false,
    loadingDone: false
  }
};

/* =========================
   UTILITIES
========================= */
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function switchScreen(showScreen) {
  [screenLoading, screenWelcome, screenApp, screenEnding]
    .forEach(s => s.classList.remove("active"));
  showScreen.classList.add("active");
}

function addMessage(text, sender = "ai") {
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateHUD() {
  trustEl.textContent = GAME.emotion.trust;
  scoreEl.textContent = GAME.score;
}

/* =========================
   LOADING FLOW
========================= */
function startLoading() {
  switchScreen(screenLoading);

  setTimeout(() => {
    GAME.system.loadingDone = true;
    switchScreen(screenWelcome);
  }, 3000); // sesuai animasi CSS
}

/* =========================
   START GAME
========================= */
function startGame() {
  const name = usernameInput.value.trim();

  if (!name) {
    usernameInput.focus();
    return;
  }

  GAME.user.name = name;
  GAME.system.started = true;

  switchScreen(screenApp);

  userInput.disabled = false;
  sendBtn.disabled = false;

  introSequence();
}

/* =========================
   INTRO SEQUENCE (AMAN)
========================= */
function introSequence() {
  addMessage("…");
  setTimeout(() => {
    addMessage(`Jadi kamu ${GAME.user.name}.`);
  }, 900);

  setTimeout(() => {
    addMessage("Jangan berharap aku ramah.");
  }, 1800);

  setTimeout(() => {
    addMessage("Bicara sembarangan, aku ingat.");
  }, 2600);
}

/* =========================
   INPUT ANALYSIS (CORE)
========================= */
function analyzeInput(text) {
  const now = Date.now();
  const delta = now - GAME.user.lastMessageTime;
  GAME.user.lastMessageTime = now;

  // spam / buru-buru
  if (delta < 700) {
    GAME.emotion.trust -= 2;
    GAME.emotion.patience -= 5;
  }

  // cuek
  if (text.length < 2) {
    GAME.emotion.trust -= 1;
    GAME.emotion.patience -= 2;
  }

  // kasar (basic)
  if (/(anj|kont|tolol|bodoh|fuck|shit)/i.test(text)) {
    GAME.emotion.trust -= 6;
    GAME.emotion.mood -= 6;
    GAME.emotion.patience -= 8;
  }

  // sopan
  if (/(maaf|sorry|tolong|terima kasih|thanks)/i.test(text)) {
    GAME.emotion.trust += 4;
    GAME.emotion.mood += 4;
  }

  GAME.emotion.trust =
    clamp(GAME.emotion.trust, -100, 100);
  GAME.emotion.mood =
    clamp(GAME.emotion.mood, -100, 100);
  GAME.emotion.patience =
    clamp(GAME.emotion.patience, 0, 100);
}

/* =========================
   FURINA CORE RESPONSE
========================= */
function furinaResponse() {
  let reply = "…";

  if (GAME.emotion.patience <= 0) {
    reply = "Aku lagi gak mau nanggepin.";
  }
  else if (GAME.emotion.trust < -20) {
    reply = "Nada kamu salah dari awal.";
  }
  else if (GAME.emotion.trust < 0) {
    reply = "Ngomongnya hati-hati.";
  }
  else if (GAME.emotion.trust < 15) {
    reply = "Lanjut.";
  }
  else {
    reply = "Hmm. Kamu masih bertahan.";
  }

  addMessage(reply, "ai");
}

/* =========================
   SEND HANDLER (SATU PINTU)
========================= */
function handleSend() {
  if (GAME.system.ended) return;

  const text = userInput.value.trim();
  if (!text) return;

  userInput.value = "";

  addMessage(text, "user");

  GAME.user.messageCount++;
  GAME.score += 1;

  analyzeInput(text);
  updateHUD();

  setTimeout(furinaResponse, 600);
}

/* =========================
   EVENT LISTENERS
========================= */
sendBtn.addEventListener("click", handleSend);

userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleSend();
});

startBtn.addEventListener("click", startGame);

/* =========================
   INIT
========================= */
startLoading();

/* =====================================================
   PART 2 — FURINA PERSONALITY & PSYCHO ENGINE
   EXTENSION LAYER (SAFE)
===================================================== */

/* =========================
   MEMORY SYSTEM
========================= */
GAME.memory = {
  facts: {},
  flags: {},
  conversationTone: "neutral",
  lastUserIntent: ""
};

/* =========================
   DATASET — CORE EMOTION WORD MAP
   (BELUM GILA, NANTI PART 3)
========================= */
const WORD_ANALYSIS = {
  affection: [
    "suka","sayang","peduli","perhatian",
    "kamu penting","aku peduli"
  ],
  curiosity: [
    "kenapa","mengapa","kok bisa","jelasin",
    "menurut kamu"
  ],
  dominance: [
    "harus","pokoknya","ikut aku","dengerin",
    "aku perintah"
  ],
  cold: [
    "terserah","yaudah","bebas","gatau",
    "capek","udah lah"
  ],
  challenge: [
    "berani","buktikan","tes","coba",
    "tantangan"
  ]
};

/* =========================
   INTENT DETECTION
========================= */
function detectIntent(text) {
  text = text.toLowerCase();

  for (const intent in WORD_ANALYSIS) {
    for (const word of WORD_ANALYSIS[intent]) {
      if (text.includes(word)) {
        return intent;
      }
    }
  }
  return "neutral";
}

/* =========================
   TONE ADJUSTER
========================= */
function adjustTone(intent) {
  switch (intent) {
    case "affection":
      GAME.emotion.trust += 5;
      GAME.emotion.mood += 6;
      GAME.memory.conversationTone = "soft";
      break;

    case "curiosity":
      GAME.emotion.trust += 2;
      GAME.memory.conversationTone = "observing";
      break;

    case "dominance":
      GAME.emotion.trust -= 6;
      GAME.emotion.mood -= 8;
      GAME.memory.conversationTone = "hostile";
      break;

    case "cold":
      GAME.emotion.trust -= 3;
      GAME.emotion.patience -= 6;
      GAME.memory.conversationTone = "cold";
      break;

    case "challenge":
      GAME.emotion.trust += 1;
      GAME.emotion.mood += 2;
      GAME.memory.conversationTone = "playful";
      break;

    default:
      GAME.memory.conversationTone = "neutral";
  }

  GAME.emotion.trust = clamp(GAME.emotion.trust, -100, 100);
  GAME.emotion.mood = clamp(GAME.emotion.mood, -100, 100);
}

/* =========================
   RESPONSE POOLS (HUMAN)
========================= */
const RESPONSE_POOL = {
  cold: [
    "Kalau cuma gitu, kenapa kamu lanjut?",
    "Nada kamu dingin. Aku balas seadanya.",
    "Aku dengar. Tapi nggak tertarik."
  ],

  hostile: [
    "Kamu kira bisa ngatur aku?",
    "Nada perintah nggak cocok di sini.",
    "Turunin ego kamu dulu."
  ],

  observing: [
    "Pertanyaan yang wajar.",
    "Menarik. Aku perhatiin caramu mikir.",
    "Lanjutkan. Jangan setengah-setengah."
  ],

  soft: [
    "Kamu bicara lebih halus sekarang.",
    "Aku perhatiin itu.",
    "Jangan rusak suasana ini."
  ],

  playful: [
    "Berani juga kamu.",
    "Aku suka orang yang nggak datar.",
    "Hati-hati, aku bisa balik nantang."
  ],

  neutral: [
    "Aku dengar.",
    "Lanjut.",
    "Aku di sini. Untuk sekarang."
  ]
};

/* =========================
   SMART RESPONSE OVERRIDE
========================= */
const _oldFurinaResponse = furinaResponse;

furinaResponse = function () {
  if (GAME.system.ended) return;

  let tone = GAME.memory.conversationTone || "neutral";
  let pool = RESPONSE_POOL[tone] || RESPONSE_POOL.neutral;

  // kondisi ekstrem
  if (GAME.emotion.patience <= 0) {
    addMessage("Aku udah capek. Diam dulu.", "ai");
    return;
  }

  if (GAME.emotion.trust <= -50) {
    addMessage(
      "Aku nggak percaya kamu. Hampir sama sekali.",
      "ai"
    );
    return;
  }

  if (GAME.emotion.trust >= 40) {
    addMessage(
      "Kamu masih di sini. Itu jarang.",
      "ai"
    );
    GAME.score += 2;
    updateHUD();
    return;
  }

  const reply =
    pool[Math.floor(Math.random() * pool.length)];

  addMessage(reply, "ai");
};

/* =========================
   INPUT EXTENSION (HOOK)
========================= */
const _oldAnalyzeInput = analyzeInput;

analyzeInput = function (text) {
  _oldAnalyzeInput(text);

  const intent = detectIntent(text);
  GAME.memory.lastUserIntent = intent;
  adjustTone(intent);
};

/* =====================================================
   PART 3 — FINAL JUDGEMENT & FLAG SYSTEM
   (ANTI-CURANG / ANTI-SPAM / LOGIC GATE)
===================================================== */

/* =========================
   SECRET CORE (PRIVATE)
========================= */
const SECRET_CORE = {
  flag: "FLAG{TRUST_IS_NOT_GIVEN_IT_IS_EARNED}",
  mathUnlocked: false,
  logicPassed: false,
  finalReady: false
};

/* =========================
   ANTI SPAM / BEHAVIOR CHECK
========================= */
GAME.system.lastMessageTime = 0;
GAME.system.spamStrike = 0;

function antiSpamCheck() {
  const now = Date.now();
  if (now - GAME.system.lastMessageTime < 900) {
    GAME.system.spamStrike++;
  } else {
    GAME.system.spamStrike = Math.max(
      GAME.system.spamStrike - 1,
      0
    );
  }
  GAME.system.lastMessageTime = now;

  if (GAME.system.spamStrike >= 4) {
    GAME.emotion.patience -= 15;
    addMessage(
      "Pelan. Aku bukan mesin otomatis.",
      "ai"
    );
  }
}

/* =========================
   LOGIC & MATH GATE
========================= */
function checkLogicTrigger(text) {
  if (
    GAME.emotion.trust >= 55 &&
    !SECRET_CORE.mathUnlocked
  ) {
    SECRET_CORE.mathUnlocked = true;
    askMathQuestion();
  }
}

function askMathQuestion() {
  GAME.system.lockInput = true;

  const a = Math.floor(Math.random() * 8) + 5;
  const b = Math.floor(Math.random() * 7) + 3;
  GAME.system.expectedAnswer = a * b + (a - b);

  addMessage(
    `Jawab ini.\n(${a} × ${b}) + (${a} − ${b}) = ?`,
    "ai"
  );
}

function checkMathAnswer(text) {
  if (!SECRET_CORE.mathUnlocked) return false;

  const num = parseInt(text);
  if (isNaN(num)) return false;

  if (num === GAME.system.expectedAnswer) {
    SECRET_CORE.logicPassed = true;
    GAME.emotion.trust += 20;
    GAME.score += 10;
    addMessage(
      "Benar.\nKamu berpikir, bukan menebak.",
      "ai"
    );
    GAME.system.lockInput = false;
    updateHUD();
    return true;
  } else {
    GAME.emotion.trust -= 12;
    addMessage(
      "Salah.\nAku bisa bedain asal jawab.",
      "ai"
    );
    return true;
  }
}

/* =========================
   FINAL JUDGEMENT CHECK
========================= */
function checkFinalState() {
  if (
    GAME.emotion.trust >= 80 &&
    GAME.emotion.mood >= 40 &&
    GAME.emotion.patience >= 40 &&
    SECRET_CORE.logicPassed &&
    !GAME.system.ended
  ) {
    triggerEnding();
  }
}

/* =========================
   ENDING SEQUENCE
========================= */
function triggerEnding() {
  GAME.system.ended = true;
  GAME.system.lockInput = true;

  setTimeout(() => {
    document
      .querySelector(".screen.active")
      .classList.remove("active");

    const end = document.getElementById("ending");
    end.classList.add("active");

    document.getElementById(
      "flagValue"
    ).innerText = SECRET_CORE.flag;
  }, 1200);
}

/* =========================
   INPUT PIPELINE EXTENSION
========================= */
const _oldHandleSend_PART3 = handleSend;

handleSend = function () {
  if (GAME.system.ended) return;

  if (GAME.system.lockInput) {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    if (checkMathAnswer(text)) {
      checkFinalState();
    }
    return;
  }

  antiSpamCheck();

  _oldHandleSend_PART3();

  const lastText =
    GAME.memory.lastUserMessage || "";

  checkLogicTrigger(lastText);
  checkFinalState();
};

/* =========================
   MEMORY TRACK LAST MESSAGE
========================= */
const _oldAnalyzeInput_PART3 = analyzeInput;

analyzeInput = function (text) {
  GAME.memory.lastUserMessage = text;
  _oldAnalyzeInput_PART3(text);
};

/* =========================
   FINAL NOTE (DEV)
========================= */
/*
  - FLAG tidak bisa muncul tanpa:
    ✔ Trust tinggi
    ✔ Mood stabil
    ✔ Sabar
    ✔ Lolos logic test
  - Spam = dihukum
  - Cuekin = dibales cuek
  - Manusia = dihargai

  by Firdaus Hidayatullah
*/

