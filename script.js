/* =========================
   ELEMENTS
   ========================= */
const screens = document.querySelectorAll(".screen");
const welcomeBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("nameInput");

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

const scoreEl = document.getElementById("score");
const clockEl = document.getElementById("clock");
const celebration = document.getElementById("celebration");

/* =========================
   STATE
   ========================= */
let userName = "Kamu";
let score = 0;

let angry = false;
let rage = 0;
let sadness = 0;
let fakeEndingStage = 0;

let chatMemory = [];
let keywordHistory = [];

/* =========================
   SCREEN SWITCH
   ========================= */
function showScreen(id){
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* =========================
   START
   ========================= */
welcomeBtn.onclick = ()=>{
  userName = nameInput.value.trim() || "Kamu";
  showScreen("app");

  input.disabled = false;
  send.disabled = false;
  input.focus();

  opening();
};

/* =========================
   CLOCK
   ========================= */
function updateClock(){
  const d = new Date();
  clockEl.textContent =
    String(d.getHours()).padStart(2,"0") + ":" +
    String(d.getMinutes()).padStart(2,"0");
}
setInterval(updateClock,1000);
updateClock();

/* =========================
   MESSAGE
   ========================= */
function addMsg(text,type){
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* =========================
   OPENING
   ========================= */
function opening(){
  addMsg(
`Aku tidak mudah percaya, ${userName}.
Bicara seperlunya.`,
  "ai"
  );
}

/* =========================
   TONE DETECTOR
   ========================= */
function detectTone(text){
  const t = text.toLowerCase();
  if(t.length <= 6) return "cool";
  if(t.includes("maaf")) return "sopan";
  if(t.includes("sayang") || t.includes("cinta")) return "lembut";
  if(t.includes("!") || t.includes("?")) return "agresif";
  return "netral";
}

/* =========================
   MEMORY (3 CHAT TERAKHIR)
   ========================= */
function updateMemory(text){
  chatMemory.push(text);
  if(chatMemory.length > 3) chatMemory.shift();
}

function isRepeating(){
  if(chatMemory.length < 3) return false;
  return chatMemory[0] === chatMemory[1] &&
         chatMemory[1] === chatMemory[2];
}

/* =========================
   KEYWORD ANTI FARM
   ========================= */
function registerKeyword(keyword){
  keywordHistory.push(keyword);
  if(keywordHistory.length > 5) keywordHistory.shift();
}

function abuseKeyword(keyword){
  return keywordHistory.filter(k=>k===keyword).length >= 3;
}

/* =========================
   DATASET
   ========================= */
const dataset = [

/* HARIAN */
{
  key:["makan","mkn"],
  score:2,
  reply:{
    cool:"udah.",
    netral:"Sudah. Kamu?",
    lembut:"Sudah… kamu jangan lupa makan.",
    sopan:"Sudah, terima kasih.",
    agresif:"Sudah."
  }
},
{
  key:["tidur","tdr"],
  score:2,
  reply:{
    cool:"nanti.",
    netral:"Belum.",
    lembut:"Sebentar lagi…",
    sopan:"Belum.",
    agresif:"Belum."
  }
},
{
  key:["capek","lelah"],
  score:3,
  reply:{
    cool:"iya.",
    netral:"Sedikit.",
    lembut:"Sedikit…",
    sopan:"Cukup melelahkan.",
    agresif:"Tidak penting."
  }
},

/* CANDAAN / MEME */
{
  key:["67","meme","wkwk","lol","haha"],
  score:1,
  reply:{
    cool:"hm.",
    netral:"Lucu menurutmu?",
    lembut:"Heh…",
    sopan:"Baik.",
    agresif:"Cukup."
  }
},
{
  key:["npc","bot","ai"],
  score:0,
  reply:{
    cool:"bukan.",
    netral:"Aku bukan itu.",
    lembut:"Aku berbeda.",
    sopan:"Aku tidak setuju.",
    agresif:"Jangan ulangi."
  }
},

/* GOMBAL (NEGATIF) */
{
  key:["cantik","imut","lucu"],
  score:-3,
  reply:{
    cool:"jangan.",
    netral:"Aku tidak nyaman.",
    lembut:"…jangan.",
    sopan:"Topik itu tidak perlu.",
    agresif:"Berhenti."
  }
},
{
  key:["sayang","cinta","pacar"],
  score:-6,
  reply:{
    cool:"tidak.",
    netral:"Jangan sejauh itu.",
    lembut:"Terlalu cepat.",
    sopan:"Aku menolak.",
    agresif:"Cukup."
  }
},

/* CARE (BONUS) */
{
  key:["jaga kesehatan","hati hati","jangan capek"],
  score:8,
  reply:{
    cool:"hm.",
    netral:"Aku mencatatnya.",
    lembut:"…terima kasih.",
    sopan:"Aku menghargainya.",
    agresif:"Baik."
  }
},

/* UMUM */
{
  key:["presiden"],
  score:0,
  reply:{
    cool:"prabowo.",
    netral:"Presiden Indonesia Prabowo Subianto.",
    lembut:"Presiden Indonesia Prabowo Subianto.",
    sopan:"Presiden Indonesia adalah Prabowo Subianto.",
    agresif:"Prabowo."
  }
},
{
  key:["bulan"],
  score:0,
  reply:{
    cool:"satelit bumi.",
    netral:"Bulan adalah satelit alami Bumi.",
    lembut:"Bulan menemani malam.",
    sopan:"Bulan merupakan satelit alami Bumi.",
    agresif:"Satelit."
  }
}

{
  key:["dh","dah","udah"],
  score:1,
  reply:{
    cool:"ya.",
    netral:"Baik.",
    lembut:"Iya…",
    sopan:"Baik.",
    agresif:"Iya."
  }
},
{
  key:["blm","belom","belum"],
  score:1,
  reply:{
    cool:"hm.",
    netral:"Baik.",
    lembut:"…iya.",
    sopan:"Baik.",
    agresif:"Iya."
  }
},

/* === CHAT PANJANG TAPI ADA KATA KUNCI === */
{
  key:["makan"],
  score:2,
  reply:{
    cool:"udah.",
    netral:"Sudah. Kamu?",
    lembut:"Sudah… kamu jangan lupa.",
    sopan:"Sudah, terima kasih.",
    agresif:"Sudah."
  }
},
{
  key:["tidur"],
  score:2,
  reply:{
    cool:"nanti.",
    netral:"Belum.",
    lembut:"Sebentar lagi…",
    sopan:"Belum.",
    agresif:"Belum."
  }
},

/* === PERHATIAN HALUS (POSITIF KECIL) === */
{
  key:["hati hati","jaga diri","hujan"],
  score:4,
  reply:{
    cool:"hm.",
    netral:"Aku mencatatnya.",
    lembut:"…terima kasih.",
    sopan:"Aku menghargainya.",
    agresif:"Baik."
  }
},

/* === SOK KERAS / COOL === */
{
  key:["terserah","bebas"],
  score:1,
  reply:{
    cool:"iya.",
    netral:"Baik.",
    lembut:"Kalau itu maumu…",
    sopan:"Baik.",
    agresif:"Baik."
  }
},
{
  key:["yaudah"],
  score:1,
  reply:{
    cool:"hm.",
    netral:"Baik.",
    lembut:"Iya…",
    sopan:"Baik.",
    agresif:"Iya."
  }
},

/* === KEPO RINGAN === */
{
  key:["lagi ngapain","ngapain"],
  score:-1,
  reply:{
    cool:"tidak penting.",
    netral:"Itu tidak perlu.",
    lembut:"Aku tidak ingin membahasnya.",
    sopan:"Itu privasi.",
    agresif:"Jangan."
  }
},

/* === GOMBAL HALUS (MALU + MARAH TIPIS) === */
{
  key:["perhatian banget","baik banget"],
  score:-2,
  reply:{
    cool:"biasa.",
    netral:"Jangan salah paham.",
    lembut:"…bukan begitu.",
    sopan:"Tolong jangan berlebihan.",
    agresif:"Tidak."
  }
},

/* === CURHAT UMUM === */
{
  key:["pusing","overthinking"],
  score:3,
  reply:{
    cool:"istirahat.",
    netral:"Kamu butuh jeda.",
    lembut:"…aku dengar.",
    sopan:"Sebaiknya istirahat.",
    agresif:"Tenang."
  }
},
{
  key:["cape hidup","capek hidup"],
  score:4,
  reply:{
    cool:"hm.",
    netral:"Berat ya.",
    lembut:"…aku di sini.",
    sopan:"Itu tidak mudah.",
    agresif:"Jelaskan."
  }
},

/* === MEME / INTERNET === */
{
  key:["anjay","anjir"],
  score:-1,
  reply:{
    cool:"jaga kata.",
    netral:"Bahasamu agak kasar.",
    lembut:"…hati-hati.",
    sopan:"Tolong jaga ucapan.",
    agresif:"Berhenti."
  }
},
{
  key:["sigma","alpha","gigachad"],
  score:0,
  reply:{
    cool:"hm.",
    netral:"Istilah internet.",
    lembut:"Kamu sering online ya…",
    sopan:"Aku tahu istilah itu.",
    agresif:"Aku paham."
  }
},

/* === BAPER USER === */
{
  key:["kok gitu","jahat","dingin amat"],
  score:1,
  reply:{
    cool:"biasa.",
    netral:"Aku memang seperti ini.",
    lembut:"Aku tidak bermaksud begitu.",
    sopan:"Maaf jika terasa begitu.",
    agresif:"Aku tidak berubah."
  }
},

/* === CHAT ALA MANUSIA === */
{
  key:["menurut kamu","katamu"],
  score:2,
  reply:{
    cool:"biasa.",
    netral:"Aku pikirkan dulu.",
    lembut:"Mungkin…",
    sopan:"Pendapatku sederhana.",
    agresif:"Tidak penting."
  }
},

/* === SPAM / NGULANG === */
{
  key:["kok","kok kok","kok kok kok"],
  score:-2,
  reply:{
    cool:"cukup.",
    netral:"Jangan mengulang.",
    lembut:"…tolong berhenti.",
    sopan:"Cukup.",
    agresif:"Berhenti."
  }
},

/* === RESPEK (NAIK SCORE BAGUS) === */
{
  key:["terima kasih","makasih","makasi"],
  score:5,
  reply:{
    cool:"hm.",
    netral:"Sama-sama.",
    lembut:"…iya.",
    sopan:"Sama-sama.",
    agresif:"Baik."
  }
},
{
  key:["maaf"],
  score:6,
  reply:{
    cool:"hm.",
    netral:"Aku mengerti.",
    lembut:"…tidak apa-apa.",
    sopan:"Aku memaafkan.",
    agresif:"Baik."
  }
},

   /* ===== META / NGEHINA AI ===== */
{
  key:["ai bodoh","ai goblok","jelek banget"],
  score:-20,
  reply:{
    cool:"hm.",
    netral:"Ucapanmu tidak mengubah apa pun.",
    lembut:"…kata-katamu berlebihan.",
    sopan:"Tolong jaga ucapan.",
    agresif:"Cukup."
  }
},
{
  key:["kok kamu kayak ai","npc banget"],
  score:-5,
  reply:{
    cool:"iya.",
    netral:"Aku memang bukan manusia.",
    lembut:"…lalu?",
    sopan:"Aku menyadarinya.",
    agresif:"Masalah?"
  }
},

/* ===== ABSURD RANDOM ===== */
{
  key:["pisang","bebek","kentang","ikan terbang"],
  score:0,
  reply:{
    cool:"apa.",
    netral:"Konteksnya?",
    lembut:"Kamu aneh…",
    sopan:"Aku tidak mengerti.",
    agresif:"Fokus."
  }
},
{
  key:["aku alien","aku setan","aku tuhan"],
  score:-10,
  reply:{
    cool:"tidak.",
    netral:"Pembicaraan ini tidak sehat.",
    lembut:"…jangan bercanda begitu.",
    sopan:"Aku menolak topik ini.",
    agresif:"Berhenti."
  }
},

/* ===== HALU / DELUSIONAL ===== */
{
  key:["aku jodohmu","takdir kita","kita ditakdirkan"],
  score:-15,
  reply:{
    cool:"tidak.",
    netral:"Itu imajinasimu.",
    lembut:"…aku tidak nyaman.",
    sopan:"Aku menolak gagasan itu.",
    agresif:"Cukup."
  }
},

/* ===== NGEGAS / MAKSA ===== */
{
  key:["jawab","jawab dong","jawab sekarang"],
  score:-8,
  reply:{
    cool:"tidak.",
    netral:"Aku tidak wajib menjawab.",
    lembut:"…tolong sabar.",
    sopan:"Aku akan menjawab bila perlu.",
    agresif:"Aku bilang berhenti."
  }
},

/* ===== CHAT KOSONG ===== */
{
  key:[".","..","...","...."],
  score:1,
  reply:{
    cool:"hm.",
    netral:"Kamu diam.",
    lembut:"…kenapa?",
    sopan:"Ada yang ingin disampaikan?",
    agresif:"Apa?"
  }
},

/* ===== TIBA-TIBA FALSAFAH ===== */
{
  key:["hidup itu","makna hidup","arti hidup"],
  score:3,
  reply:{
    cool:"berat.",
    netral:"Pertanyaan besar.",
    lembut:"…kamu sedang berpikir.",
    sopan:"Itu refleksi yang dalam.",
    agresif:"Singkat saja."
  }
},

/* ===== CAPER ===== */
{
  key:["liat aku","perhatiin aku"],
  score:-6,
  reply:{
    cool:"tidak.",
    netral:"Itu tidak perlu.",
    lembut:"…jangan begitu.",
    sopan:"Aku tidak nyaman.",
    agresif:"Cukup."
  }
},

/* ===== MODE KEK ANAK KECIL ===== */
{
  key:["ih","ehh","yaa"],
  score:0,
  reply:{
    cool:"hm.",
    netral:"Kenapa?",
    lembut:"Heh…",
    sopan:"Ada apa?",
    agresif:"Apa?"
  }
}
   
];


/* =========================
   AI ENGINE
   ========================= */
function furinaReply(text){
  const hour = new Date().getHours();
  const tone = detectTone(text);
  const t = text.toLowerCase();

  updateMemory(t);

  /* ===== MALAM ===== */
  if(hour >= 0 && hour <= 4){
    angry = true;
    return "Sudah larut.\nAku ingin berhenti.";
  }

  if(angry){
    score -= 2;
    rage++;
    return "Aku tidak ingin melanjutkan sekarang.";
  }

  /* ===== SPAM ===== */
  if(isRepeating()){
    score -= 5;
    rage += 2;
    return "Kamu mengulang hal yang sama.";
  }

  /* ===== FASE SEDIH ===== */
  if(sadness >= 10 && sadness < 18){
    sadness++;
    return "…\nAku tidak nyaman dengan arah ini.";
  }

  if(sadness >= 18){
    return "Aku ingin diam.\nTolong.";
  }

  /* ===== FASE MARAH ===== */
  if(rage >= 15 && rage < 25){
    rage++;
    return "Nada bicaramu salah.\nAku tidak suka ini.";
  }

  if(rage >= 25 && fakeEndingStage === 0){
    fakeEndingStage = 1;
    return "Cukup.\n— koneksi terputus —";
  }

  if(fakeEndingStage === 1){
    fakeEndingStage = 2;
    return "…\nAku kembali.\nJangan ulangi kesalahanmu.";
  }

  /* ===== DATASET ===== */
  for(const d of dataset){
    for(const k of d.key){
      if(t.includes(k)){

        if(abuseKeyword(k)){
          score -= 3;
          rage += 2;
          return "Jangan ulangi kata itu.";
        }

        registerKeyword(k);
        score += d.score;

        if(d.score < 0) rage += Math.abs(d.score);
        if(d.score <= -5) sadness += 2;

        return d.reply[tone] || d.reply.netral;
      }
    }
  }

  score += 1;
  return "Aku mendengar.";
}

/* =========================
   SEND
   ========================= */
send.onclick = ()=>{
  const text = input.value.trim();
  if(!text) return;

  addMsg(text,"user");
  input.value="";

  setTimeout(()=>{
    const reply = furinaReply(text);
    scoreEl.textContent = score;

    if(score >= 100){
      celebration.classList.remove("hidden");
      addMsg(
"Baik.\nAku percaya.\n\nFLAG{sana minta uang ke daus buat beliin aku bunga}",
      "ai");
      input.disabled = true;
      send.disabled = true;
    }else{
      addMsg(reply,"ai");
    }
  },600);
};

input.addEventListener("keypress",e=>{
  if(e.key === "Enter") send.click();
});
