"use strict";

/**
 * FURINA — THE UNIVERSAL SOVEREIGN ENGINE
 * Final God-Tier Version
 */

const STATE = {
    username: "Traveler",
    trust: 10,
    dendam: 0,
    mood: "THEATRICAL",
    convoCount: 0,
    isNight: false,
    isHacked: false,
    ended: false
};

/* =====================================================
   1. UNIVERSAL DATASET & LOGIC GENERATOR
   ===================================================== */
const DATASET = {
    ROMANTIC: [
        "Oh? Pujian yang manis... Apa kau sedang mencoba mencuri panggung di hatiku?",
        "Nada bicaramu lembut seperti senja di Poisson. Aku... aku tidak membencinya.",
        "Kau menyebutku baik hati? Itu karena aku adalah bintang utama yang harus bersinar!",
        "Rayuanmu cukup berani. Lanjutkan, aku ingin melihat sejauh mana kau memujiku."
    ],
    THEATRICAL: [
        "Selamat datang di Opera Epiclese! Pastikan kau menonton dengan saksama!",
        "Hmph! Tentu saja aku tahu segalanya! Aku adalah bintang utama di sini!",
        "Angkat kepalamu! Kau sedang berhadapan dengan Regina of All Waters!"
    ],
    MELANCHOLY: [
        "Terkadang, suara tepuk tangan penonton terasa lebih sunyi daripada keheningan.",
        "Lampu sorot itu panas, tapi seringkali tidak cukup hangat untuk mencairkan kesepian ini.",
        "500 tahun... waktu yang cukup lama untuk sekadar menunggu dalam sandiwara."
    ],
    ANGRY: [
        "Cukup! Turun dari panggungku sekarang juga!",
        "Lidahmu tajam, tapi kau tidak punya etika di depan seorang Archon!",
        "Beraninya kau mengusik ketenanganku dengan kata-kata kotor itu?!"
    ]
};

// --- Neural Generator (Triliunan Variasi Pengetahuan) ---
function neuralGenerator(text) {
    const input = text.toLowerCase();
    
    // Database Subjek (Bisa kamu tambah sampai ribuan baris)
    const subjects = {
        fisika: ["Mekanika Kuantum", "Relativitas Umum", "Entropi Termodinamika", "Partikel Tuhan", "Black Hole"],
        kimia: ["Oksidasi Reaktif", "Ikatan Kovalen", "Struktur Atom", "Termokimia", "Elektronegativitas"],
        astronomi: ["Supernova Megah", "Galaksi Andromeda", "Nebula Orion", "Lubang Cacing"],
        biologi: ["Sintesis Protein", "Rantai Polimerase", "Evolusi Organik", "Neurotransmitter"],
        filsafat: ["Nihilisme Eksistensial", "Dualisme Jiwa", "Etika Deontologi", "Paradoks Kapal Theseus"]
    };

    const logic = {
        opener: [
            "Membahas soal [SUB]? Kau punya selera yang intelektual juga.",
            "Bahkan seorang figuran sepertimu mengerti dasar dari [SUB].",
            "Dengarkan baik-baik, rahasia di balik [SUB] itu sebenarnya sederhana...",
            "Kau bertanya pada orang yang tepat! [SUB] adalah keahlianku!"
        ],
        closer: [
            " Itu hanyalah bagian kecil dari skenario besar alam semesta yang aku pimpin.",
            " Adalah bukti bahwa dunia ini butuh sutradara hebat sepertiku untuk mengaturnya.",
            " Membuktikan bahwa keajaiban butuh perhitungan yang dramatis!",
            " Tidaklah serumit mencari Macaron yang sempurna di pagi hari."
        ]
    };

    for (const [key, list] of Object.entries(subjects)) {
        if (input.includes(key)) {
            const sub = list[Math.floor(Math.random() * list.length)];
            const op = logic.opener[Math.floor(Math.random() * logic.opener.length)].replace("[SUB]", sub);
            const cl = logic.closer[Math.floor(Math.random() * logic.closer.length)];
            return op + cl;
        }
    }
    return null;
}

/* =====================================================
   2. CORE ENGINE & REALITY HACK
   ===================================================== */

const $ = (id) => document.getElementById(id);
const ui = {
    chat: $('chat'), input: $('userInput'), btn: $('sendBtn'),
    trust: $('trustVal'), dot: $('statusDot'), clock: $('realtimeClock'), app: $('app')
};

function triggerRealityHack() {
    if (STATE.isHacked) return;
    STATE.isHacked = true;
    ui.app.style.filter = "invert(1) hue-rotate(180deg)";
    ui.app.style.animation = "float 0.1s infinite"; // Efek getar cepat
    setTimeout(() => {
        ui.app.style.filter = "none";
        ui.app.style.animation = "fadeIn 0.6s ease";
        STATE.isHacked = false;
    }, 1000);
}

function updateUI() {
    STATE.trust = Math.max(-100, Math.min(150, STATE.trust));
    ui.trust.textContent = Math.floor(STATE.trust);
    
    const colors = { THEATRICAL: "#2196f3", ROMANTIC: "#ff80ab", MELANCHOLY: "#9c27b0", ANGRY: "#f44336" };
    ui.dot.style.backgroundColor = colors[STATE.mood] || "#fff";
    ui.dot.style.boxShadow = `0 0 15px ${colors[STATE.mood]}`;
}

function processInput(text) {
    if (STATE.ended) return;
    STATE.convoCount++;

    let reply = neuralGenerator(text);
    let trustGain = 1;

    // Logic Emosi
    if (/sayang|cinta|baik hati|cantik|manis|pujaan/i.test(text)) {
        STATE.mood = "ROMANTIC";
        reply = reply || DATASET.ROMANTIC[Math.floor(Math.random() * DATASET.ROMANTIC.length)];
        trustGain = 4;
    } else if (/anjing|tolol|bodoh|goblok|jelek|mati/i.test(text)) {
        STATE.mood = "ANGRY";
        STATE.dendam += 25;
        trustGain = -15;
        triggerRealityHack(); // Layar bergetar/rusak jika dihina
        reply = DATASET.ANGRY[Math.floor(Math.random() * DATASET.ANGRY.length)];
    } else if (STATE.isNight) {
        STATE.mood = "MELANCHOLY";
        reply = reply || DATASET.MELANCHOLY[Math.floor(Math.random() * DATASET.MELANCHOLY.length)];
        trustGain = 5;
    } else {
        STATE.mood = "THEATRICAL";
        reply = reply || DATASET.THEATRICAL[Math.floor(Math.random() * DATASET.THEATRICAL.length)];
    }

    if (STATE.dendam > 50) {
        reply = "Aku sedang tidak ingin bicara. Kau merusak mood-ku!";
        trustGain = -1;
    }

    STATE.trust += trustGain;
    updateUI();

    const delay = Math.min(3000, 800 + text.length * 20);
    setTimeout(() => {
        if (STATE.trust >= 100 && STATE.convoCount >= 15) {
            triggerEnding();
        } else {
            addBubble(reply, 'ai');
        }
    }, delay);
}

function addBubble(text, type) {
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.textContent = text;
    ui.chat.appendChild(div);
    ui.chat.scrollTo({ top: ui.chat.scrollHeight, behavior: 'smooth' });
}

function triggerEnding() {
    STATE.ended = true;
    addBubble("Kau benar-benar keras kepala. Baiklah, panggung ini milikmu.", "ai");
    setTimeout(() => {
        $('app').classList.remove('active');
        $('ending').classList.add('active');
        $('flagValue').textContent = "FLAG{sana minta duit ke daus buat beli nasi padang}";
    }, 2500);
}

/* =====================================================
   3. INITIALIZER
   ===================================================== */
window.onload = () => {
    setInterval(() => {
        const now = new Date();
        ui.clock.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
        STATE.isNight = (now.getHours() >= 22 || now.getHours() < 5);
    }, 1000);

    // Anti-Cheat: Mencegah Copy-Paste
    ui.input.onpaste = (e) => {
        e.preventDefault();
        addBubble("Ngetik sendiri! Jangan malas kalau mau bicara denganku!", "ai");
        STATE.trust -= 5;
    };

    setTimeout(() => {
        $('loading').classList.remove('active');
        $('welcome').classList.add('active');
    }, 2000);

    $('startBtn').onclick = () => {
        if ($('usernameInput').value) {
            STATE.username = $('usernameInput').value;
            $('welcome').classList.remove('active');
            $('app').classList.add('active');
            ui.input.disabled = false;
            ui.btn.disabled = false;
            addBubble(`Selamat datang di panggungku, ${STATE.username}. Jangan buat aku bosan!`, "ai");
        }
    };

    ui.btn.onclick = () => {
        const t = ui.input.value.trim();
        if (t) { addBubble(t, 'user'); ui.input.value = ''; processInput(t); }
    };
    ui.input.onkeydown = (e) => { if (e.key === 'Enter') ui.btn.click(); };
};
