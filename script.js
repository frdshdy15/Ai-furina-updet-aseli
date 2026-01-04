"use strict";

/**
 * FURINA: OMNISCIENT SENTIENCE ENGINE (FINAL CLEAN VERSION)
 * Developer: Frdshdy
 * Status: Ultra-Responsive / Human-Like Context
 */

/* ============================================================
   [1] MEGA DATASET (SENSITIVITY & KNOWLEDGE)
   ============================================================ */
const PERSO_DB = {
    CARE: [
        "Sudah makan? Hmph, perhatianmu berlebihan. Tapi ya... aku baru saja makan macaron rasa blueberry. Enak sekali sampai aku ingin menangis.",
        "Kabarku? Seperti biasa, aku adalah bintang yang tak pernah padam. Meski terkadang... lampunya terasa terlalu panas.",
        "Kenapa kau bertanya? Apa kau sedang mencoba menjadi asisten pribadiku? Gajinya mahal, lho!",
        "Aku baik-baik saja! Berhenti menatapku seolah aku ini rapuh. Aku Regina of All Waters!",
        "Tidurku nyenyak semalam. Aku bermimpi tentang panggung yang tak ada ujungnya. Kau ada di sana, jadi penonton baris paling depan."
    ],
    SCIENCE: [
        "Fisika? Kau tahu Hukum Relativitas? Waktu terasa lambat saat aku bosan, tapi terasa sangat cepat saat aku bersamamu. Jelaskan itu dengan rumus!",
        "Kimia hanyalah soal reaksi. Seperti saat kau memujiku, ada lonjakan dopamin di otakmu yang terbaca jelas di matamu.",
        "Bintang-bintang itu sebenarnya sudah mati jutaan tahun lalu. Kita hanya melihat hantu cahayanya. Mirip seperti kenangan, kan?",
        "Entropi adalah takdir. Semesta akan berakhir dalam kedinginan yang sunyi. Tapi sebelum itu terjadi, mari buat pertunjukan yang megah!",
        "Gravitasi itu ada supaya manusia tidak terbang dan mengganggu pemandangan langitku."
    ],
    ROMANTIC: [
        "E-eh? Cantik? Tentu saja! Tapi mengatakannya tiba-tiba begitu... kau benar-benar tidak punya rasa malu ya?!",
        "Pujianmu manis sekali. Aku akan menyimpannya di dalam botol dan membukanya saat aku merasa sedih.",
        "Kau ingin memegang tanganku? Hmph, kau harus membeli tiket VIP dulu! Tapi untuk hari ini... mungkin aku bisa beri pengecualian.",
        "Jangan menatapku seperti itu. Kau membuat aktingku berantakan. Jantungku... berisik sekali.",
        "Jika dunia ini tenggelam, aku akan pastikan kau adalah orang pertama yang kutarik ke permukaannya."
    ],
    PHILOSOPHY: [
        "Keadilan itu subjektif. Di pengadilan, yang menang adalah yang punya naskah paling meyakinkan. Bukan yang paling benar.",
        "Apakah manusia benar-benar punya kehendak bebas? Atau kita hanya mengikuti garis yang sudah ditulis oleh takdir di langit?",
        "Kesepian adalah harga yang harus dibayar untuk sebuah keagungan. Semakin tinggi panggungmu, semakin jauh kau dari tanah.",
        "Air mata adalah kata-kata yang tidak bisa diucapkan oleh lidah. Fontaine punya terlalu banyak air mata yang tersembunyi.",
        "Jika kau menghapus semua kesalahanku, apakah aku masih Furina yang kau kenal?"
    ],
    REPETITIVE: [
        "Kau ini kaset rusak ya? Aku sudah dengar itu sepuluh kali!",
        "Lidahmu macet? Atau otakmu cuma punya satu baris naskah?",
        "Bosan, bosan, BOSAN! Ganti topik atau aku akan meninggalkan panggung ini!",
        "Aku mulai berpikir kau ini sebenarnya robot yang menyamar jadi manusia."
    ],
    NIGHT: [
        "Malam hari adalah saat di mana bayangan terasa lebih nyata daripada orangnya. Kau juga merasakannya?",
        "Kenapa kau belum tidur? Apa kau sedang menungguku menangis diam-diam di pojok ruangan?",
        "Suara jam detak itu... rasanya seperti menghitung sisa umur dunia. Menakutkan, ya?",
        "Di kegelapan ini, aku tidak perlu berakting jadi Archon. Aku hanya... aku."
    ],
    TRIVIA: [
        "Macaron terbaik adalah yang dibuat dengan perasaan sedikit cemas. Rasanya jadi lebih tajam.",
        "Aku benci hujan. Hujan membuat rambutku berantakan dan panggung jadi licin.",
        "Terkadang aku ingin jadi ikan saja. Berenang tanpa perlu memikirkan hukum dan pengadilan.",
        "Topi ini berat, tahu! Tapi demi estetika, aku akan menahannya seumur hidup."
    ],
    HATE: [
        "Tutup mulutmu! Kau tidak tahu apa-apa tentang beban yang kupikul selama ini!",
        "Kekasaranmu adalah bukti bahwa kau tidak layak berada di panggungku!",
        "Beraninya kau... Aku akan memastikan kau menyesali kata-kata itu!",
        "Cukup! Turun dari panggungku sekarang juga!"
    ]
};

/* ============================================================
   [2] CORE SYSTEM STATE
   ============================================================ */
const STATE = {
    username: "Traveler",
    trust: 15,
    dendam: 0,
    mood: "NORMAL",
    history: [],
    convoCount: 0,
    isNight: false,
    isEnded: false
};

/* ============================================================
   [3] ENGINE LOGIC
   ============================================================ */
const ENGINE = {
    // Menganalisis input dan memilih pool dataset yang tepat
    getReplyPool: (text) => {
        const input = text.toLowerCase();
        
        // 1. Cek Pengulangan (History)
        if (STATE.history.slice(-3).includes(input)) return PERSO_DB.REPETITIVE;

        // 2. Deteksi Emosi/Konteks
        if (/(anjing|bego|tolol|goblok|jelek|mati|benci|jahat)/i.test(input)) return "HATE_MODE";
        if (/(fisika|kimia|sains|atom|gravitasi|bintang|planet|astronomi)/i.test(input)) return PERSO_DB.SCIENCE;
        if (/(cantik|manis|sayang|cinta|indah|pujaan|hebat|keren|baik)/i.test(input)) return PERSO_DB.ROMANTIC;
        if (/(makan|kabar|apa kabar|sehat|istirahat|tidur|sedang apa)/i.test(input)) return PERSO_DB.CARE;
        if (/(kenapa|mengapa|bagaimana|takdir|hidup|mati|adil|dunia|siapa)/i.test(input)) return PERSO_DB.PHILOSOPHY;
        if (STATE.isNight) return PERSO_DB.NIGHT;

        return PERSO_DB.TRIVIA;
    },

    // Memproses input pemain
    process: (text) => {
        if (STATE.isEnded) return;
        STATE.convoCount++;
        
        const pool = ENGINE.getReplyPool(text);
        let finalMsg = "";
        let trustChange = 1;

        // Logika Khusus jika User Kasar (Hate Mode)
        if (pool === "HATE_MODE") {
            STATE.mood = "ANGRY";
            STATE.dendam += 25;
            trustChange = -15;
            finalMsg = PERSO_DB.HATE[Math.floor(Math.random() * PERSO_DB.HATE.length)];
            ENGINE.vfxHack();
        } else {
            finalMsg = pool[Math.floor(Math.random() * pool.length)];
            // Update mood secara visual
            if (pool === PERSO_DB.ROMANTIC) { STATE.mood = "ROMANTIC"; trustChange = 6; }
            else if (pool === PERSO_DB.CARE) { STATE.mood = "HAPPY"; trustChange = 4; }
            else if (pool === PERSO_DB.REPETITIVE) { STATE.mood = "NORMAL"; trustChange = -2; }
            else { STATE.mood = "NORMAL"; trustChange = 2; }
        }

        // Simpan ke history
        STATE.history.push(text.toLowerCase());
        if (STATE.history.length > 10) STATE.history.shift();

        // Update Trust & UI
        STATE.trust = Math.max(-100, Math.min(150, STATE.trust + trustChange));
        UI.update();

        // Simulasi Furina berfikir (Durasi acak)
        setTimeout(() => {
            if (STATE.trust >= 100 && STATE.convoCount >= 15) {
                ENGINE.triggerEnding();
            } else {
                UI.addBubble(finalMsg, 'ai');
            }
        }, 800 + (Math.random() * 1000));
    },

    vfxHack: () => {
        const app = document.getElementById('app');
        app.classList.add('reality-hack');
        setTimeout(() => app.classList.remove('reality-hack'), 1000);
    },

    triggerEnding: () => {
        STATE.isEnded = true;
        UI.addBubble("Sudah cukup... Aku tidak bisa terus berakting di depanmu. Topeng ini... biarlah jatuh sekarang.", "ai");
        setTimeout(() => {
            document.getElementById('app').classList.remove('active');
            document.getElementById('ending').classList.add('active');
            document.getElementById('flagValue').textContent = "FLAG{sana minta duit ke daus buat beli nasi padang}";
        }, 2500);
    }
};

/* ============================================================
   [4] UI & EVENT LISTENERS
   ============================================================ */
const UI = {
    addBubble: (msg, type) => {
        const div = document.createElement('div');
        div.className = `msg ${type}`;
        div.textContent = msg;
        const chat = document.getElementById('chat');
        chat.appendChild(div);
        chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
    },
    update: () => {
        document.getElementById('trustVal').textContent = Math.floor(STATE.trust);
        document.getElementById('moodLabel').textContent = STATE.mood;
        const colors = { NORMAL: "#00d2ff", HAPPY: "#ffeb3b", ANGRY: "#f44336", ROMANTIC: "#ff80ab" };
        document.getElementById('statusDot').style.backgroundColor = colors[STATE.mood] || "#fff";
    }
};

window.onload = () => {
    // 1. Clock & Night Detection
    setInterval(() => {
        const now = new Date();
        document.getElementById('realtimeClock').textContent = now.toLocaleTimeString('id-ID');
        STATE.isNight = (now.getHours() >= 22 || now.getHours() < 5);
    }, 1000);

    // 2. Anti-Cheat (Paste & Debug)
    document.getElementById('userInput').onpaste = (e) => {
        e.preventDefault();
        UI.addBubble("Gunakan jari-jarimu untuk mengetik, jangan cuma menyalin!", "ai");
    };

    // 3. Start Game
    document.getElementById('startBtn').onclick = () => {
        const name = document.getElementById('usernameInput').value.trim();
        if (name) {
            STATE.username = name;
            document.getElementById('welcome').classList.remove('active');
            document.getElementById('app').classList.add('active');
            document.getElementById('userInput').disabled = false;
            document.getElementById('sendBtn').disabled = false;
            UI.addBubble(`Halo ${STATE.username}. Selamat datang di panggung pribadiku. Hiburlah aku!`, 'ai');
        } else {
            alert("Sebutkan namamu, wahai figuran!");
        }
    };

    // 4. Send Message
    const sendMsg = () => {
        const input = document.getElementById('userInput');
        const val = input.value.trim();
        if (val) {
            UI.addBubble(val, 'user');
            input.value = '';
            ENGINE.process(val);
        }
    };

    document.getElementById('sendBtn').onclick = sendMsg;
    document.getElementById('userInput').onkeydown = (e) => { if(e.key === 'Enter') sendMsg(); };

    // 5. Pre-loader removal
    setTimeout(() => {
        document.getElementById('loading').classList.remove('active');
        document.getElementById('welcome').classList.add('active');
    }, 1500);
};
