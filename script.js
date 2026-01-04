"use strict";

/**
 * FURINA: HUMAN-LOGIC ENGINE (V6.0)
 * Fitur: Anti-Repeat, Topic Locking, Emotional Memory Recall
 */

const STATE = {
    username: "Traveler",
    trust: 40,
    mood: "NORMAL",
    currentTopic: "none", // Menjaga agar obrolan nyambung
    history: [], // Mencegah pengulangan kalimat yang sama
    memoryBank: {
        sadPoints: 0,
        userStory: ""
    }
};

// --- DATASET YANG TERSTRUKTUR (Bukan Acak Total) ---
const BRAIN = {
    TOPICS: {
        CARE: {
            keywords: ["makan", "minum", "sehat", "kabar", "istirahat", "tidur"],
            replies: [
                "Aku baru saja menikmati teh kembang sepatu. Rasanya pahit-manis, persis seperti kenangan.",
                "Seorang bintang harus menjaga staminanya. Aku harap kau juga tidak lupa merawat dirimu.",
                "Kenapa kau bertanya? Apa kau ingin mengirimkan nampan macaron ke kamarku?",
                "Tidur adalah satu-satunya saat di mana aku tidak perlu berakting. Aku baru saja bangun dari mimpi yang panjang."
            ]
        },
        VENTING: {
            keywords: ["sedih", "capek", "lelah", "gagal", "masalah", "sendiri", "nangis"],
            replies: [
                "Ceritakan padaku. Panggung ini sedang kosong, aku punya waktu untuk mendengarkan bebanmu.",
                "Dunia luar memang keras ya? Fontaine pun pernah hampir tenggelam, tapi kita masih di sini.",
                "Jangan menahan air mata itu. Biarkan ia jatuh seperti hujan di Opera Epiclese. Aku tidak akan menghakimimu.",
                "Kadang menjadi kuat itu melelahkan. Sini, duduklah di sampingku sejenak."
            ]
        },
        ROMANCE: {
            keywords: ["sayang", "cinta", "cantik", "manis", "suka", "kagum"],
            replies: [
                "Pujianmu... sedikit terlalu jujur. Aku tidak terbiasa dengan ketulusan yang mendadak.",
                "Hmph! Tentu saja aku cantik. Tapi kau... kau punya cara unik untuk mengatakannya.",
                "Kau membuat naskahku berantakan. Jantungku berdetak di luar tempo musik.",
                "Apa ini bagian dari trikmu untuk mencuri perhatian sang Archon?"
            ]
        }
    },
    FILLER: [
        "Hmm, aku mengerti maksudmu.",
        "Menarik... lanjutkan ceritamu.",
        "Aku mendengarkan, jangan berhenti di situ.",
        "Begitu ya? Rasanya aku mulai memahami warnamu."
    ]
};

const ENGINE = {
    // 1. MENCARI TOPIK (Agar Nyambung)
    determineTopic: (input) => {
        for (let key in BRAIN.TOPICS) {
            if (BRAIN.TOPICS[key].keywords.some(k => input.toLowerCase().includes(k))) {
                return key;
            }
        }
        return STATE.currentTopic; // Tetap di topik sebelumnya jika tidak ada keyword baru
    },

    // 2. LOGIKA ANTI-NGULANG (Anti-Repetition)
    pickUniqueReply: (topic) => {
        const pool = BRAIN.TOPICS[topic] ? BRAIN.TOPICS[topic].replies : BRAIN.FILLER;
        
        // Filter kalimat yang belum pernah dipakai baru-baru ini
        let available = pool.filter(msg => !STATE.history.includes(msg));
        
        // Jika semua sudah dipakai, reset history khusus topik tersebut
        if (available.length === 0) {
            STATE.history = STATE.history.filter(msg => !pool.includes(msg));
            available = pool;
        }

        const picked = available[Math.floor(Math.random() * available.length)];
        STATE.history.push(picked);
        
        // Batasi history agar tidak berat
        if (STATE.history.length > 15) STATE.history.shift();
        
        return picked;
    },

    process: (text) => {
        const input = text.toLowerCase();
        const newTopic = ENGINE.determineTopic(input);
        
        // Jika user curhat (Venting), tambah poin empati
        if (newTopic === "VENTING") {
            STATE.memoryBank.sadPoints++;
            STATE.trust += 5;
            STATE.mood = "WARM";
        } else if (newTopic === "ROMANCE") {
            STATE.trust += 7;
            STATE.mood = "ROMANTIC";
        } else {
            STATE.mood = "NORMAL";
        }

        STATE.currentTopic = newTopic;
        UI.update();

        // Simulasi Furina "mengetik" dengan durasi yang manusiawi
        const delay = 1500 + (input.length * 20);
        
        setTimeout(() => {
            if (STATE.trust >= 150) {
                ENGINE.triggerEnding();
            } else {
                let reply = ENGINE.pickUniqueReply(newTopic);
                
                // Tambahkan sentuhan personal jika sudah sering curhat
                if (STATE.memoryBank.sadPoints > 3 && Math.random() > 0.7) {
                    reply = "Hei... kau sudah banyak bercerita tentang kesedihanmu. Aku sungguh ingin kau bahagia hari ini.";
                    STATE.memoryBank.sadPoints = 0; // Reset
                }

                UI.addBubble(reply, 'ai');
            }
        }, delay);
    },

    triggerEnding: () => {
        document.getElementById('app').classList.remove('active');
        document.getElementById('ending').classList.add('active');
        document.getElementById('flagValue').textContent = "FLAG{minta uang ke daus buat beli nasi padang}";
    }
};

const UI = {
    addBubble: (msg, type) => {
        const chat = document.getElementById('chat');
        const div = document.createElement('div');
        div.className = `msg ${type}`;
        div.textContent = msg;
        chat.appendChild(div);
        chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
    },
    update: () => {
        document.getElementById('trustVal').textContent = Math.floor(STATE.trust);
        document.getElementById('moodLabel').textContent = STATE.mood;
        const colors = { NORMAL: "#00d2ff", WARM: "#ffeb3b", ROMANTIC: "#ff80ab" };
        document.getElementById('statusDot').style.backgroundColor = colors[STATE.mood];
    }
};

// --- INITIALIZER (Tombol & Event) ---
window.onload = () => {
    document.getElementById('startBtn').onclick = () => {
        const name = document.getElementById('usernameInput').value;
        if (name) {
            STATE.username = name;
            document.getElementById('welcome').classList.remove('active');
            document.getElementById('app').classList.add('active');
            document.getElementById('userInput').disabled = false;
            document.getElementById('sendBtn').disabled = false;
            UI.addBubble(`Panggung sudah siap, ${STATE.username}. Apa yang ingin kau curahkan padaku?`, 'ai');
        }
    };

    const sendMessage = () => {
        const input = document.getElementById('userInput');
        if (input.value.trim()) {
            UI.addBubble(input.value, 'user');
            ENGINE.process(input.value);
            input.value = '';
        }
    };

    document.getElementById('sendBtn').onclick = sendMessage;
    document.getElementById('userInput').onkeydown = (e) => { if(e.key === 'Enter') sendMessage(); };
    
    setInterval(() => {
        document.getElementById('realtimeClock').textContent = new Date().toLocaleTimeString('id-ID');
    }, 1000);

    setTimeout(() => {
        document.getElementById('loading').classList.remove('active');
        document.getElementById('welcome').classList.add('active');
    }, 1000);
};
