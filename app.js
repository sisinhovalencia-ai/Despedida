// ═══════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════

const REVEAL_AT = 64;
const TW_SPEED  = 28;

// Letra de la canción → aparece en la carta sincronizada con la música
const LETTER_PARTS = [
  { t: 20,  text: "Solo por tener la oportunidad de conquistar tu corazón…"     },
  { t: 26,  text: "Podrías poner el listón más allá de las estrellas."           },
  { t: 32,  text: "Haré cualquier cosa, cualquier cosa que me pidas."            },
  { t: 43,  text: "Dime que quieres la luna, y verás cómo aprendo a volar."      },
  { t: 49,  text: "No hay montaña que puedas señalar que yo no escalaría."       },
  { t: 56,  text: "Es una locura, pero es verdad, no hay nada que no haría."     },
  { t: 64,  text: "Lo arriesgaría todo por ti."                                  },
  { t: 72,  text: "Para tomar tu mano y llamarte mía."                           },
  { t: 78,  text: "Estoy tratando de ser tu hombre hasta el fin de los tiempos." },
  { t: 84,  text: "Oh, haré cualquier cosa, cualquier cosa que me pidas."        },
  { t: 95,  text: "Correría a través del fuego solo para estar a tu lado."       },
  { t: 102, text: "Si tu corazón está en juego, puedes quedarte con el mío."     },
  { t: 108, text: "Es una locura, pero es verdad, no hay nada que no haría."     },
  { t: 116, text: "Lo arriesgaría todo por ti."                                  }
];

// Frases flotantes — aparecen dispersas por toda la pantalla
// size: 'sm' | 'md' | 'lg'   pos: { top/bottom/left/right } en %
const FLOATING_PHRASES = [
  { t: 4,   text: "Me gustas tal como eres 🙂",          size: "md", pos: { top:18, left:55 } },
  { t: 8,   text: "Tienes algo especial ✨",             size: "sm", pos: { top:10, left:20 } },
  { t: 12,  text: "Contigo todo fluye 😌",              size: "sm", pos: { top:30, left:8  } },
  { t: 16,  text: "Me gusta cómo piensas 🧠✨",         size: "lg", pos: { top:22, left:38 } },
  { t: 20,  text: "Eres diferente, en buen sentido 😉", size: "sm", pos: { top:40, right:6 } },
  { t: 25,  text: "Me agrada tu forma de ser 🤍",       size: "md", pos: { top:55, left:12 } },
  { t: 30,  text: "Hay algo en ti que destaca 🔥",      size: "lg", pos: { top:14, right:10} },
  { t: 36,  text: "Tienes una vibra bonita 🌸",         size: "sm", pos: { top:62, right:18} },
  { t: 42,  text: "Me gustas, simple así 🙂",           size: "md", pos: { top:35, left:42 } },
  { t: 49,  text: "Eres especial, de verdad ✨",         size: "lg", pos: { top:48, left:28 } },
  { t: 56,  text: "Me quedo con lo bueno de ti 🌙",     size: "sm", pos: { top:20, left:65 } },
  { t: 62,  text: "Tienes una sonrisa bonita 🌸",       size: "md", pos: { top:70, left:50 } },
  { t: 70,  text: "Me gustas, pero doy espacio ⏳",     size: "sm", pos: { top:28, right:30} },
  { t: 78,  text: "No es adiós, es un hasta luego 👋",  size: "md", pos: { top:58, right:8 } },
  { t: 85,  text: "Todo queda tranquilo 😌",            size: "lg", pos: { top:45, left:55 } },
  { t: 93,  text: "Cuídate mucho, mi peque 💫",         size: "md", pos: { top:32, left:18 } },
  { t: 100, text: "Gracias por los momentos 🤍",        size: "sm", pos: { top:65, left:22 } },
  { t: 108, text: "Feliz cumpleaños, Vicky 🎂🥳",       size: "lg", pos: { top:15, left:30 } },
  { t: 116, text: "Sigue brillando siempre 🌟",         size: "md", pos: { top:52, right:22} },
  { t: 122, text: "Eres muy especial para mí ✨",       size: "sm", pos: { top:75, left:40 } },
];

// ═══════════════════════════════════════════════════════

let started    = false;
let cueIdx     = 0;
let phraseIdx  = 0;
let letterIdx  = 0;
let revealed   = false;
let ended      = false;
let envOpened  = false;
let twQueue    = [];
let twRunning  = false;

// ── FECHA ──
(function () {
  const d = new Date();
  const m = ['enero','febrero','marzo','abril','mayo','junio',
             'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const el = document.getElementById('letterDate');
  if (el) el.textContent = `${d.getDate()} de ${m[d.getMonth()]}, ${d.getFullYear()}`;
})();

// ── TRANSICIÓN ──
function goToVinyl() {
  document.getElementById('screen-intro')?.classList.add('hidden');
  setTimeout(() => {
    const vinyl = document.getElementById('screen-vinyl');
    vinyl?.classList.remove('hidden');
    document.body.style.overflow = 'hidden auto';
    document.getElementById('stamp')?.classList.add('in');
    startExperience();
  }, 500);
}

// ── TYPEWRITER ──
function enqueuePart(text) {
  twQueue.push(text);
  if (!twRunning) drainQueue();
}
function drainQueue() {
  if (!twQueue.length) { twRunning = false; return; }
  twRunning = true;
  writeText(twQueue.shift(), drainQueue);
}
function writeText(text, onDone) {
  const body = document.getElementById('letter-body');
  const cur  = document.getElementById('cursor');
  if (!body) { onDone(); return; }
  if (cur) cur.style.display = 'inline-block';
  const isFirst = !body.querySelector('.letter-para');
  const para = document.createElement('p');
  para.className = 'letter-para';
  if (!isFirst) para.style.marginTop = '.85em';
  body.insertBefore(para, cur);
  let i = 0;
  (function tick() {
    if (i < text.length) {
      para.appendChild(document.createTextNode(text[i++]));
      setTimeout(tick, TW_SPEED);
    } else { onDone(); }
  })();
}

// ── SOBRE ──
function openEnvelope() {
  if (envOpened) return;
  envOpened = true;
  const env    = document.getElementById('envelope');
  const reveal = document.getElementById('letterReveal');
  env?.classList.add('opening');
  setTimeout(() => env?.classList.add('opened'), 400);
  setTimeout(() => reveal?.classList.add('open'), 920);
}

// ── FRASE FLOTANTE dispersa en pantalla ──
function spawnFloatingPhrase(item) {
  const layer = document.getElementById('phrases-layer');
  if (!layer) return;

  const el = document.createElement('div');
  el.className = `floating-phrase size-${item.size}`;
  el.textContent = item.text;

  // Posición
  const p = item.pos;
  if (p.top    != null) el.style.top    = p.top    + '%';
  if (p.bottom != null) el.style.bottom = p.bottom + '%';
  if (p.left   != null) el.style.left   = p.left   + '%';
  if (p.right  != null) el.style.right  = p.right  + '%';

  layer.appendChild(el);

  // Fade in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('visible'));
  });

  // Fade out después de 5s
  setTimeout(() => {
    el.classList.add('fading');
    setTimeout(() => el.remove(), 1300);
  }, 5000);
}

// ── PROGRESO + BRAZO ──
function startProgress(audio, arm) {
  document.getElementById('progressTrack')?.classList.add('show');
  (function update() {
    if (audio.duration) {
      const r = audio.currentTime / audio.duration;
      const fill = document.getElementById('progressFill');
      if (fill) fill.style.width = (r * 100) + '%';
      if (arm)  arm.style.transform = `rotate(${12 + r * 18}deg)`;
    }
    requestAnimationFrame(update);
  })();
}

// ── PARTÍCULAS ──
function spawnParticles() {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i = 0; i < 36; i++) {
    const el = document.createElement('div');
    el.className = 'p';
    const size = 1.4 + Math.random() * 2;
    const col  = Math.random() > .5 ? '#c9a84c' : '#f0e2c8';
    el.style.cssText = `
      width:${size}px;height:${size}px;background:${col};
      left:${Math.random()*100}%;bottom:0;
      --dx:${(Math.random()-.5)*160}px;
      animation:rise ${13+Math.random()*10}s linear ${Math.random()*8}s infinite;
    `;
    c.appendChild(el);
  }
}

// ── INICIO ──
function startExperience() {
  if (started) return;
  started = true;

  const disc    = document.getElementById('disc');
  const arm     = document.getElementById('armWrap');
  const glow    = document.getElementById('glowRing');
  const audio   = document.getElementById('audio');
  const envArea = document.getElementById('envelopeArea');

  setTimeout(() => arm?.classList.add('on-record'), 300);

  setTimeout(() => {
    disc?.classList.add('spinning');
    glow?.classList.add('lit');
    if (audio) {
      audio.volume = 0;
      audio.play().catch(() => {});
      let v = 0;
      const fi = setInterval(() => {
        v = Math.min(v + 0.04, 1);
        audio.volume = v;
        if (v >= 1) clearInterval(fi);
      }, 80);
    }
    startProgress(audio, arm);
    spawnParticles();
  }, 1500);

  setTimeout(() => envArea?.classList.add('in'), 4000);
  setTimeout(() => openEnvelope(), 5600);

  // Función reutilizable para mostrar el mini sobre
  const showMiniEnv = () => {
    const fw = document.getElementById('mini-envelope-btn');
    if (fw && !fw.classList.contains('show')) fw.classList.add('show');
  };
  // Fallback: aparece a los 125s si la canción no llegó al final
  setTimeout(showMiniEnv, REVEAL_AT * 1000 + 1500);

  // ── SINCRONIZACIÓN ──
  audio?.addEventListener('timeupdate', () => {
    const t = audio.currentTime;

    // Carta (letra de la canción)
    while (letterIdx < LETTER_PARTS.length && t >= LETTER_PARTS[letterIdx].t) {
      enqueuePart(LETTER_PARTS[letterIdx].text);
      letterIdx++;
      if (letterIdx >= LETTER_PARTS.length) {
        const lastLen = LETTER_PARTS[LETTER_PARTS.length - 1].text.length;
        // Espera a que termine de escribirse el último párrafo
        setTimeout(() => {
          document.getElementById('cursor')?.classList.add('done');
          document.getElementById('closing')?.classList.add('show');
          document.getElementById('divider')?.classList.add('show');
          // Mini sobre aparece 2s después del cierre de la carta
          setTimeout(showMiniEnv, 2000);
        }, lastLen * TW_SPEED + 900);
      }
    }

    // Frases flotantes dispersas
    while (phraseIdx < FLOATING_PHRASES.length && t >= FLOATING_PHRASES[phraseIdx].t) {
      spawnFloatingPhrase(FLOATING_PHRASES[phraseIdx]);
      phraseIdx++;
    }

    // Collage de fotos
    if (!revealed && t >= REVEAL_AT) {
      revealed = true;
      document.getElementById('backdrop')?.classList.add('visible');
    }

    // Fin de canción con fade out
    if (!ended && audio.duration && t >= audio.duration - 0.25) {
      ended = true;
      const fo = setInterval(() => {
        if (audio.volume > 0.04) audio.volume = Math.max(0, audio.volume - 0.04);
        else { audio.volume = 0; audio.pause(); clearInterval(fo); }
      }, 80);
    }
  });
}

// ── MINI SOBRE — abrir / cerrar popup ──
// ATAJO DE PRUEBA: doble clic en "Lado A · Para siempre" muestra el sobre
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('stamp')?.addEventListener('dblclick', () => {
    document.getElementById('mini-envelope-btn')?.classList.add('show');
  });
});
function openMiniLetter() {
  const overlay = document.getElementById('mini-letter-overlay');
  if (overlay) overlay.classList.add('open');
}
function closeMiniLetter() {
  const overlay = document.getElementById('mini-letter-overlay');
  if (overlay) overlay.classList.remove('open');
}