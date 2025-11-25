const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
const characters = 'アァカサタナハマヤャラワガザダバパ...0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@$%&*+-';
const fontSize = 16;
let columns;
let drops;
function resetDrops() {
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns);
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }
}
resetDrops();
window.addEventListener('resize', resetDrops);
const emptyZonePercent = 0.60;
function getEmptyZone() {
    const emptyWidth = canvas.width * emptyZonePercent;
    const left = (canvas.width - emptyWidth) / 2;
    const right = left + emptyWidth;
    return { left, right };
}
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';
    const zone = getEmptyZone();
    const fadeSize = 150;
    for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        let alpha = 1;
        if (x > zone.left - fadeSize && x < zone.left) {
            alpha = (x - (zone.left - fadeSize)) / fadeSize;
        }
        if (x > zone.right && x < zone.right + fadeSize) {
            alpha = 1 - ((x - zone.right) / fadeSize);
        }
        if (x >= zone.left && x <= zone.right) continue;
        if (alpha <= 0) continue;
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const y = drops[i] * fontSize;
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.fillText(text, x, y);
        if (y > canvas.height && Math.random() > 0.985) drops[i] = 0;
        drops[i]++;
    }
    requestAnimationFrame(draw);
}
draw();

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&/?..................................Ԫ";
class TextScrambler {
constructor(element) {
    this.el = element;
    this.chars = SCRAMBLE_CHARS;
    this.original = element.dataset.text || element.textContent;
    this.frameRequest = null;
    this.queue = [];
    this.frame = 0;
    if (!element.dataset.text) {
    element.dataset.text = this.original;
    }
}
randomChar() {
    const idx = Math.floor(Math.random() * this.chars.length);
    return this.chars[idx];
}
setScrambled() {
    if (this.frameRequest) {
    cancelAnimationFrame(this.frameRequest);
    this.frameRequest = null;
    }
    const scrambled = this.original
    .split("")
    .map((c) => (c === " " || c === "\n" ? c : this.randomChar()))
    .join("");
    this.el.textContent = scrambled;
}
reveal() {
    if (this.frameRequest) {
cancelAnimationFrame(this.frameRequest);
    }
    const current = this.el.textContent.padEnd(this.original.length, " ");
    this.queue = [];
    const length = this.original.length;
    for (let i = 0; i < length; i++) {
    const from = current[i] || " ";
    const to = this.original[i] || " ";
    const start = Math.floor(Math.random() * 5);                     // mikor kezd zizegni
    const end = start + 5 + Math.floor(Math.random() * 50);          // mennyiszer scramble-öl
    this.queue.push({ from, to, start, end, char: null });
    }
    this.frame = 0;
    const update = () => {
    let output = "";
    let complete = 0;
    const length = this.queue.length;
    for (let i = 0; i < length; i++) {
        const item = this.queue[i];
        const from = item.from;
        const to = item.to;
        const start = item.start;
        const end = item.end;
        if (this.frame >= end) {
        complete++;
        output += to;
        } else if (this.frame >= start) {
        if (!item.char || Math.random() < 0.2) {
            item.char = this.randomChar();
        }
        output += item.char;
        } else {
        output += from;
        }
    }
    this.el.textContent = output;
    this.frame++;
    if (complete < length) {
        this.frameRequest = requestAnimationFrame(update);
    } else {
        this.frameRequest = null;
    }
    };
    update();
}
}

document.addEventListener("DOMContentLoaded", () => {
const cards = document.querySelectorAll(".theory-card");

cards.forEach((card) => {
    const elements = card.querySelectorAll(".scramble-text");
    elements.forEach((el) => {
    if (!el.dataset.text) {
        el.dataset.text = el.textContent;
    }
    el.textContent = el.dataset.text;
    });
});

cards.forEach((card) => {
    const h = card.offsetHeight;
    card.style.minHeight = h + "px";
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const card = entry.target;
        const scramblers = card.scramblers;

        if (entry.isIntersecting) {
            scramblers.forEach((s) => s.reveal());
        } else {
            scramblers.forEach((s) => s.setScrambled());
        }
    });
}, { threshold: 0.3 });

cards.forEach(card => {
    const elements = card.querySelectorAll(".scramble-text");
    card.scramblers = Array.from(elements).map((el) => new TextScrambler(el));

    card.scramblers.forEach((s) => s.setScrambled());

    observer.observe(card);
});



  const titleEl = document.querySelector(".sect-header header h1");
  if (titleEl) {
    const fullText = titleEl.textContent;
    let index = 0;
    const typeSpeed = 160; // ms / karakter

    titleEl.textContent = "";
    const startTitleGlitchLoop = (el, text) => {
      const minDelay = 2000; // 1000 = 1s
      const maxDelay = 5000; // 1000 = 1s
      const scheduleGlitch = () => {
        const delay =
          Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
        setTimeout(() => runGlitchOnce(el, text, scheduleGlitch), delay);
      };
      const runGlitchOnce = (el, text, onDone) => {
        if (text.length < 2) {
          onDone && onDone();
          return;
        }
        const base = text.slice(0, text.length - 2);
        const lastTwo = text.slice(text.length - 2);
        let i = 0;
        let phase = "delete";
        const step = () => {
          if (phase === "delete") {
            if (i < 2) {
              el.textContent = text.slice(0, text.length - 1 - i);
              i++;
              setTimeout(step, 120);
            } else {
              phase = "type";
              i = 0;
              setTimeout(step, 180);
            }
          } else {
            if (i < 2) {
              el.textContent = base + lastTwo.slice(0, i + 1);
              i++;
              setTimeout(step, 120);
            } else {
              onDone && onDone();
            }
          }
        };
        step();
      };
      scheduleGlitch();
    };
    const typeIn = () => {
      if (index <= fullText.length) {
        titleEl.textContent = fullText.slice(0, index);
        index++;
        setTimeout(typeIn, typeSpeed);
      } else {
        startTitleGlitchLoop(titleEl, fullText);
      }
    };
    typeIn();
  }
});