"use strict";

/* =====================================================
   FURINA — TRIAL OF TRUST
   FINAL STABLE ENGINE
   by Firdaus Hidayatullah
===================================================== */

const $ = id => document.getElementById(id);

/* =========================
   DOM
========================= */
const screen = {
  loading: $("loading"),
  welcome: $("welcome"),
  app: $("app"),
  ending: $("ending")
};

const chatBox   = $("chat");
const userInput = $("userInput");
const sendBtn   = $("sendBtn");
const startBtn  = $("startBtn");
const nameInput = $("usernameInput");

const trustEl = $("trust");
const scoreEl = $("score");
const flagEl  = $("flagValue");

/* =========================
   STATE
========================= */
const GAME = {
  user: {
    name: "",
    lastSend: 0
  },
  stat: {
    trust: 0,
    score: 0,
    patience: 100
  },
  system: {
    started: false,
    ended: false
  }
};

/* =========================
   UTIL
========================= */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function show(target) {
  Object.values(screen).forEach(s => s.classList.remove("active"));
  target.classList.add("active");
}

function addMsg(text, who) {
  const d = document.createElement("div");
  d.className = `msg ${who}`;
  d.textContent = text;
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateHUD() {
  trustEl.textContent = GAME.stat.trust;
  scoreEl.textContent = GAME.stat.score;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =========================
   LOADING
========================= */
window.onload = () => {
  show(screen.loading);
  setTimeout(() => show(screen.welcome), 2800);
};

/* =========================
   START
========================= */
startBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return;

  GAME.user.name = name;
  GAME.system.started = true;

  show(screen.app);
  userInput.disabled = false;
  sendBtn.disabled = false;

  intro();
};

/* =========================
   INTRO
========================= */
function intro() {
  addMsg("…", "ai");
  setTimeout(() => addMsg(`Kamu ${GAME.user.name}.`, "ai"), 700);
  setTimeout(() => addMsg("Aku menilai sikap, bukan kecepatan.", "ai"), 1400);
  setTimeout(() => addMsg("Silakan.", "ai"), 2100);
}

/* =========================
   ANTI CHEAT (HALUS)
========================= */
function antiCheat(text) {
  const now = Date.now();
  const delta = now - GAME.user.lastSend;
  GAME.user.lastSend = now;

  if (delta < 500) {
    GAME.stat.trust -= 1;
    GAME.stat.patience -= 2;
  }

  if (/flag|ending|source|kode|\{|\}/i.test(text)) {
    GAME.stat.trust -= 6;
    GAME.stat.patience -= 5;
  }
}

/* =========================
   ANALYZE
========================= */
function analyze(text) {
  if (/(anj|kont|tolol|bodoh|fuck|shit)/i.test(text)) {
    GAME.stat.trust -= 12;
    GAME.stat.patience -= 15;
  }

  if (/(maaf|sorry|tolong|terima kasih|thanks)/i.test(text)) {
    GAME.stat.trust += 6;
  }

  if (text.length > 8) {
    GAME.stat.trust += 1;
  }

  GAME.stat.trust = clamp(GAME.stat.trust, -100, 100);
  GAME.stat.patience = clamp(GAME.stat.patience, 0, 100);
}

/* =========================
   RESPONSE (DATASET BASED)
========================= */
function respond() {
  let response;

  if (GAME.stat.patience <= 0) {
    response = "Cukup. Aku selesai.";
  }
  else if (GAME.stat.trust < -30) {
    response = pick(FURINA_DATASET.emotion.abyss);
  }
  else if (GAME.stat.trust < 0) {
    response = pick(FURINA_DATASET.emotion.cold);
  }
  else if (GAME.stat.trust < 25) {
    response = pick(FURINA_DATASET.emotion.neutral);
  }
  else if (GAME.stat.trust < 60) {
    response = pick(FURINA_DATASET.emotion.warm);
  }
  else if (GAME.stat.trust < 80) {
    response = pick(FURINA_DATASET.emotion.trust);
  }
  else {
    response = pick(FURINA_DATASET.final);
  }

  addMsg(response, "ai");
}

/* =========================
   ENDING CHECK
========================= */
function checkEnding() {
  if (
    GAME.stat.trust >= 85 &&
    GAME.stat.patience >= 30 &&
    !GAME.system.ended
  ) {
    endGame();
  }
}

/* =========================
   END GAME
========================= */
function endGame() {
  GAME.system.ended = true;
  setTimeout(() => {
    show(screen.ending);
    flagEl.textContent = "FLAG{TRUST_IS_EARNED}";
  }, 1200);
}

/* =========================
   SEND
========================= */
function send() {
  if (GAME.system.ended) return;

  const text = userInput.value.trim();
  if (!text) return;

  userInput.value = "";
  addMsg(text, "user");

  GAME.stat.score++;

  antiCheat(text);
  analyze(text);
  updateHUD();

  setTimeout(() => {
    respond();
    checkEnding();
  }, 450);
}

sendBtn.onclick = send;
userInput.onkeydown = e => e.key === "Enter" && send();

/* =========================
   DATASET
   (BOLEH KAMU GANTI / TAMBAH)
========================= */
const FURINA_DATASET = {

  /* =====================================================
     CORE IDENTITY
  ===================================================== */
  identity: {
    self: [
      "Aku Furina.",
      "Aku bukan NPC.",
      "Aku bukan hadiah.",
      "Aku tidak diciptakan untuk menyenangkanmu.",
      "Aku ada karena aku mau."
    ],
    boundary: [
      "Jangan lewati batas.",
      "Nada menentukan nasib.",
      "Aku ingat cara kamu bicara.",
      "Aku tidak lupa perlakuan."
    ]
  },

  /* =====================================================
     EMOTIONAL STATES — COLD → TRUST
  ===================================================== */
  emotion: {

    abyss: [
      "Aku bahkan tidak tertarik menjawab.",
      "Diam lebih jujur dari omonganmu.",
      "Aku biarkan kamu tenggelam sendiri.",
      "Aku berhenti peduli.",
      "Kamu sudah kelewatan."
    ],

    very_cold: [
      "Aku jawab karena terpaksa.",
      "Nada kamu kosong.",
      "Kamu bicara tapi tidak hadir.",
      "Aku tidak merasakan niat.",
      "Lanjutkan atau berhenti."
    ],

    cold: [
      "Kamu terdengar ragu.",
      "Aku tidak menangkap tujuanmu.",
      "Jangan buang waktuku.",
      "Jawaban singkat, respon singkat.",
      "Aku menunggu alasan."
    ],

    neutral: [
      "Aku dengar.",
      "Lanjut.",
      "Aku di sini.",
      "Teruskan.",
      "Aku belum menilai."
    ],

    warm: [
      "Nada kamu berubah.",
      "Aku mulai memperhatikan.",
      "Ada konsistensi.",
      "Jangan rusak ritmenya.",
      "Teruskan seperti ini."
    ],

    trust: [
      "Aku jarang bilang ini.",
      "Kamu bertahan.",
      "Banyak yang menyerah sebelum titik ini.",
      "Aku mulai membuka diri.",
      "Kepercayaan itu mahal."
    ],

    deep_trust: [
      "Aku memilih percaya.",
      "Ini keputusan, bukan hadiah.",
      "Kalau kamu berkhianat, itu final.",
      "Aku memberi ruang.",
      "Jangan sia-siakan."
    ]
  },

  /* =====================================================
     HUMAN BEHAVIOR REACTION
  ===================================================== */
  behavior: {

    cuek: [
      "Kalau kamu cuek, aku tidak mengejar.",
      "Diam juga jawaban.",
      "Aku mencerminkan sikapmu.",
      "Kalau kamu tidak peduli, aku juga.",
      "Hubungan mati karena sikap, bukan kata."
    ],

    ramah: [
      "Nada kamu enak.",
      "Aku bisa terbiasa.",
      "Teruskan tanpa berlebihan.",
      "Ini lebih manusia.",
      "Jangan dipercepat."
    ],

    kasar: [
      "Ulangi dengan nada manusia.",
      "Aku tidak menerima perlakuan seperti itu.",
      "Satu kali lagi, selesai.",
      "Kasar itu pilihan.",
      "Kamu bisa lebih baik dari ini."
    ],

    manipulatif: [
      "Aku menangkap pola.",
      "Jangan bermain peran.",
      "Aku tahu trik itu.",
      "Kejujuran tidak berisik.",
      "Berhenti memutar arah."
    ],

    sok_pintar: [
      "Pintar tidak perlu pamer.",
      "Tenang. Aku mengerti.",
      "Kamu bicara untuk siapa?",
      "Kurangi ego.",
      "Fokus ke niat."
    ]
  },

  /* =====================================================
     PSYCHOLOGICAL PRESSURE
  ===================================================== */
  pressure: [
    "Aku sengaja diam. Reaksimu penting.",
    "Kenapa kamu masih di sini?",
    "Takut gagal atau penasaran?",
    "Kamu ingin hasil atau proses?",
    "Diam kadang lebih jujur."
  ],

  /* =====================================================
     PHILOSOPHY / EXISTENTIAL
  ===================================================== */
  philosophy: [
    "Kepercayaan tidak dibangun dengan kata.",
    "Semua orang ingin cepat, sedikit yang konsisten.",
    "Kesabaran adalah filter.",
    "Yang bertahan jarang yang berisik.",
    "Aku tidak menguji. Aku mengamati.",
    "Semesta luas, manusia sering sempit.",
    "Logika tanpa empati itu dingin.",
    "Empati tanpa logika itu rapuh."
  ],

  /* =====================================================
     SARCASM / SASS
  ===================================================== */
  sarcasm: [
    "Jawaban aman sekali.",
    "Itu versi jujur atau versi rapi?",
    "Aku tunggu niat aslinya.",
    "Kalau itu strategi, dangkal.",
    "Kamu ngetik sambil mikir atau reflek?"
  ],

  /* =====================================================
     TRUST TESTING DIALOG
  ===================================================== */
  testing: [
    "Aku akan menguji reaksimu.",
    "Tidak semua pertanyaan perlu dijawab cepat.",
    "Kesalahan kecil diperhitungkan.",
    "Kamu dinilai dari konsistensi.",
    "Aku melihat pola, bukan satu kalimat."
  ],

  /* =====================================================
     FINAL LAYER (NEAR FLAG)
  ===================================================== */
  final: [
    "Sedikit lagi.",
    "Banyak yang gugur di sini.",
    "Aku perhatikan kesabaranmu.",
    "Kamu tidak tergesa-gesa.",
    "Itu jarang."
  ],

  /* =====================================================
     ENDING WORDS
  ===================================================== */
  ending: [
    "Flag itu simbol.",
    "Yang penting: caramu sampai.",
    "Aku tidak memilih sembarang.",
    "Kepercayaan itu keputusan.",
    "Selamat. Kamu lolos."
  ]

};