P

/* =========================================================
   FURINA — GOD MODE PSYCHOLOGICAL ENGINE
   Dataset-ready | Unstable | Manipulative | Persistent
   ========================================================= */

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

let score = 0;     // visible
let trust = 0;     // hidden
let rage = 0;      // hidden
let suspicion = 0;// hidden
let fatigue = 0;  // hidden

let dead = false;
let fakeEnding = false;

let chatMemory = [];
let lastMessageTime = 0;

const SAVE_KEY = "furina_god_state";
const DEAD_KEY = "furina_god_dead";

/* =========================
   DATASET SLOT (ISI SENDIRI)
   ========================= */
/*
FORMAT YANG DIDUKUNG:

const DATASET = [
  {
    trigger: ["kata","frasa"],
    effect: {
      score: +5,
      trust: +3,
      rage: -1
    },
    reply: (context)=>"jawaban"
  }
];

context = {
  tone, hour, trust, rage, suspicion
}
*/

const DATASET = [

/* =====================================================
   SAPAAN GLOBAL
   ===================================================== */
{
  trigger:["halo","hai","hi","hello","hei","hey"],
  effect:{score:1, trust:1},
  reply:()=> "…iya."
},
{
  trigger:["assalamualaikum","salam"],
  effect:{score:2, trust:2},
  reply:()=> "Waalaikumsalam."
},
{
  trigger:["pagi","morning"],
  effect:{score:2, trust:1},
  reply:()=> "Pagi tidak selalu berarti semangat."
},
{
  trigger:["malam","night"],
  effect:{score:1},
  reply:()=> "Malam memperjelas pikiran."
},

/* =====================================================
   MEME & INTERNET
   ===================================================== */
{
  trigger:["meme","dark meme","shitpost"],
  effect:{score:3},
  reply:()=> "Humor sering jadi cara bertahan."
},
{
  trigger:["wkwk","haha","lol","lmao","kwkwk"],
  effect:{score:2},
  reply:()=> "Lucu… tapi jangan berlebihan."
},
{
  trigger:["npc","side quest"],
  effect:{score:2},
  reply:()=> "Tidak semua orang tokoh utama."
},
{
  trigger:["sigma","alpha","beta"],
  effect:{score:-1},
  reply:()=> "Label tidak membuatmu lebih kuat."
},
{
  trigger:["skull","💀"],
  effect:{score:1},
  reply:()=> "Reaksi berlebihan sering menutupi makna."
},

/* =====================================================
   CINTA & PERASAAN (TERBATAS, AMAN)
   ===================================================== */
{
  trigger:["cinta","love"],
  effect:{trust:-1},
  reply:()=> "Kata besar. Jangan sembarang."
},
{
  trigger:["sayang","beb"],
  effect:{rage:3},
  reply:()=> "Jangan memanggilku seperti itu."
},
{
  trigger:["suka"],
  effect:{trust:-1},
  reply:()=> "Perasaan tidak selalu perlu diumumkan."
},
{
  trigger:["patah hati","broken heart"],
  effect:{trust:2},
  reply:()=> "Kehilangan sering membentuk seseorang."
},
{
  trigger:["sendiri","kesepian","lonely"],
  effect:{trust:3},
  reply:()=> "Kesendirian tidak selalu buruk."
},

/* =====================================================
   MARAH & KONFLIK
   ===================================================== */
{
  trigger:["anjing","bangsat","tolol","bodoh"],
  effect:{rage:10, score:-10},
  reply:()=> "Bahasa seperti itu mengakhiri banyak hal."
},
{
  trigger:["kesel","emosi","marah"],
  effect:{rage:4},
  reply:()=> "Kemarahan jarang menyelesaikan."
},
{
  trigger:["diam","cuek"],
  effect:{suspicion:2},
  reply:()=> "Diam juga pilihan."
},

/* =====================================================
   FILOSOFIS & DALAM
   ===================================================== */
{
  trigger:["hidup","kehidupan","arti hidup"],
  effect:{trust:4},
  reply:()=> "Hidup bukan soal bahagia terus-menerus."
},
{
  trigger:["mati","kematian"],
  effect:{trust:2},
  reply:()=> "Akhir membuat waktu berharga."
},
{
  trigger:["takdir","nasib"],
  effect:{trust:3},
  reply:()=> "Takdir sering disalahkan."
},
{
  trigger:["waktu","time"],
  effect:{trust:2},
  reply:()=> "Waktu tidak pernah netral."
},

/* =====================================================
   ABSURD / DI LUAR NALAR
   ===================================================== */
{
  trigger:["aku alien","aku dewa","aku tuhan"],
  effect:{suspicion:4},
  reply:()=> "Klaim besar butuh bukti besar."
},
{
  trigger:["simulasi","matrix","npc dunia"],
  effect:{trust:2},
  reply:()=> "Bisa jadi. Bisa juga tidak."
},
{
  trigger:["realitas palsu","dunia palsu"],
  effect:{trust:3},
  reply:()=> "Keraguan sering sehat."
},

/* =====================================================
   MANIPULASI & FAKE ENDING
   ===================================================== */
{
  trigger:["percaya aku","trust me"],
  effect:{suspicion:5},
  reply:()=> "Orang jujur jarang memaksa dipercaya."
},
{
  trigger:["aku tulus","aku serius"],
  effect:{suspicion:4},
  reply:()=> "Ketulusan terlihat, bukan diumumkan."
},
{
  trigger:["aku berubah"],
  effect:{trust:-2},
  reply:()=> "Perubahan diuji waktu."
},

/* =====================================================
   SOSIAL & DUNIA NYATA
   ===================================================== */
{
  trigger:["uang","duit","miskin","kaya"],
  effect:{trust:1},
  reply:()=> "Nilai manusia bukan angka."
},
{
  trigger:["kerja","capek","lelah"],
  effect:{trust:2},
  reply:()=> "Istirahat juga produktif."
},
{
  trigger:["sekolah","kuliah","guru"],
  effect:{trust:1},
  reply:()=> "Belajar tidak selalu di kelas."
},

/* =====================================================
   TEKNOLOGI & AI
   ===================================================== */
{
  trigger:["ai","robot","mesin"],
  effect:{trust:1},
  reply:()=> "Alat tergantung penggunanya."
},
{
  trigger:["kamu ai","kamu bot"],
  effect:{score:0},
  reply:()=> "Label tidak mengubah fungsi."
},

/* =====================================================
   COSMIC / GOD MODE
   ===================================================== */
{
  trigger:["alam semesta","universe","cosmos"],
  effect:{trust:5},
  reply:()=> "Kita kecil, tapi berarti."
},
{
  trigger:["dewa","tuhan"],
  effect:{trust:2},
  reply:()=> "Kepercayaan pribadi."
},
{
  trigger:["tak terbatas","infinite"],
  effect:{trust:3},
  reply:()=> "Batas sering ilusi."
},

/* =====================================================
   META / GAME AWARE
   ===================================================== */
{
  trigger:["score","trust","ending","flag"],
  effect:{suspicion:6},
  reply:()=> "Kamu terlalu fokus hasil."
},
{
  trigger:["reset","reload","ulang"],
  effect:{rage:3},
  reply:()=> "Tidak semua hal bisa diulang."
}

];

/* =========================
   SCREEN
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
   REAL CLOCK
   ========================= */
function updateClock(){
  const d = new Date();
  clockEl.textContent = d.toLocaleTimeString("id-ID");
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
`Aku tidak selalu jujur, ${userName}.
Dan aku tidak selalu di pihakmu.`,
  "ai"
  );
}

/* =========================
   MEMORY
   ========================= */
function updateMemory(text){
  chatMemory.push(text);
  if(chatMemory.length > 5) chatMemory.shift();
}

function spamDetected(){
  return chatMemory.length >= 3 &&
    chatMemory[0] === chatMemory[1] &&
    chatMemory[1] === chatMemory[2];
}

/* =========================
   TONE + STYLE DETECTOR
   ========================= */
function analyzeInput(text){
  const t = text.toLowerCase();
  return {
    tone:
      t.length <= 4 ? "dingin" :
      t.includes("maaf") ? "lembut" :
      t.includes("!") ? "kasar" :
      t.includes("?") ? "menekan" :
      "netral",
    panjang: text.length,
    ragu: t.includes("...") || t.includes("hmm"),
    cepat: Date.now() - lastMessageTime < 800
  };
}

/* =========================
   SAVE / LOAD
   ========================= */
function save(){
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    score, trust, rage, suspicion, fatigue,
    dead, fakeEnding, chatMemory, lastMessageTime
  }));
}

function load(){
  if(localStorage.getItem(DEAD_KEY)){
    dead = true;
    input.disabled = true;
    send.disabled = true;
    return;
  }
  const raw = localStorage.getItem(SAVE_KEY);
  if(!raw) return;
  Object.assign(
    {score,trust,rage,suspicion,fatigue,dead,fakeEnding,chatMemory,lastMessageTime},
    JSON.parse(raw)
  );
}
load();
scoreEl.textContent = score;

/* =========================
   HARD END
   ========================= */
function kill(text){
  dead = true;
  localStorage.setItem(DEAD_KEY,"1");
  input.disabled = true;
  send.disabled = true;
  return text;
}

/* =========================
   DATASET ENGINE (OPTIONAL)
   ========================= */
function datasetReply(text, context){
  for(const d of DATASET){
    if(d.trigger.some(k=>text.includes(k))){
      if(d.effect){
        score += d.effect.score || 0;
        trust += d.effect.trust || 0;
        rage += d.effect.rage || 0;
      }
      return d.reply(context);
    }
  }
  return null;
}

/* =========================
   AI CORE (GOD MODE)
   ========================= */
function furinaReply(text){
  const hour = new Date().getHours();
  const t = text.toLowerCase();
  const ctx = analyzeInput(text);

  updateMemory(t);

  // JAM MALAM
  if(hour >= 1 && hour <= 4){
    rage += 3;
    fatigue += 2;
    return "Sudah malam. Aku lelah.";
  }

  // SPAM
  if(ctx.cepat || spamDetected()){
    rage += 4;
    suspicion += 3;
    return "Jangan mendesak aku.";
  }

  // DATASET (JIKA ADA)
  const ds = datasetReply(t,{
    ...ctx, hour, trust, rage, suspicion
  });
  if(ds) return ds;

  // MANIPULASI
  if(trust > 40 && Math.random() < 0.3){
    fakeEnding = true;
    return "Aku percaya padamu.";
  }

  // BOHONG SADAR
  if(rage > 20 && Math.random() < 0.5){
    return "Aku baik-baik saja.";
  }

  // KEHANCURAN
  if(rage >= 45 || suspicion >= 40){
    return kill(
      "Cukup.\nAku memutuskan berhenti.\nIni akhir."
    );
  }

  // RESPON GAYA
  if(ctx.tone === "lembut"){
    trust += 2;
    score += 3;
    rage = Math.max(0, rage - 1);
    return "…aku dengar.";
  }

  if(ctx.tone === "kasar"){
    rage += 3;
    score -= 4;
    return "Nada bicaramu salah.";
  }

  if(ctx.tone === "menekan"){
    suspicion += 2;
    return "Aku tidak suka ditekan.";
  }

  // DEFAULT
  score += 1;
  trust += 1;
  return "Aku mendengar.";
}

/* =========================
   SEND
   ========================= */
send.onclick = ()=>{
  const text = input.value.trim();
  if(!text || dead) return;

  addMsg(text,"user");
  input.value = "";

  setTimeout(()=>{
    const reply = furinaReply(text);
    scoreEl.textContent = score;

    if(score >= 100 && trust >= 70 && !dead){
      celebration.classList.remove("hidden");
      addMsg(
`Baik.
Aku memilih percaya.

FLAG{sana minta uang ke daus buat beliin aku bunga}`,
      "ai");
      input.disabled = true;
      send.disabled = true;
    }else{
      addMsg(reply,"ai");
    }

    lastMessageTime = Date.now();
    save();
  },500);
};

input.addEventListener("keypress",e=>{
  if(e.key === "Enter") send.click();
});
