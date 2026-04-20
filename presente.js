const imagens    = document.querySelectorAll(".galeria img");
const dotsEl     = document.getElementById("dots");
const progressEl = document.getElementById("progress");
const descEl     = document.getElementById("desc");
const contEl     = document.getElementById("contador");

const DESCS    = ["Família", "Família 2", "Gatão"];
const INTERVALO = 5000;

let index = 0, autoplay = true, timer = null;

// Cria os dots dinamicamente
imagens.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " ativo" : "");
  dot.setAttribute("aria-label", `Ir para imagem ${i + 1}`);
  dot.onclick = () => irPara(i);
  dotsEl.appendChild(dot);
});

function mostrarImagem(i) {
  imagens.forEach(img => img.classList.remove("ativa"));
  document.querySelectorAll(".dot").forEach(d => d.classList.remove("ativo"));

  imagens[i].classList.add("ativa");
  document.querySelectorAll(".dot")[i].classList.add("ativo");

  if (descEl)  descEl.textContent  = DESCS[i] ?? "";
  if (contEl)  contEl.textContent  = `${i + 1} / ${imagens.length}`;
}

function iniciarProgress() {
  progressEl.style.transition = "none";
  progressEl.style.width      = "0%";
  requestAnimationFrame(() => requestAnimationFrame(() => {
    progressEl.style.transition = `width ${INTERVALO}ms linear`;
    progressEl.style.width      = "100%";
  }));
}

function iniciarAutoplay() {
  clearInterval(timer);
  if (!autoplay) return;
  iniciarProgress();
  timer = setInterval(() => {
    index = (index + 1) % imagens.length;
    mostrarImagem(index);
    iniciarProgress();
  }, INTERVALO);
}

function irPara(i) {
  index = i;
  mostrarImagem(i);
  iniciarAutoplay();
}

function proximo()  { irPara((index + 1) % imagens.length); }
function anterior() { irPara((index - 1 + imagens.length) % imagens.length); }
function voltar()   { window.location.href = "index.html"; }

// Swipe touch
let touchX = 0;
document.querySelector(".galeria").addEventListener("touchstart", e => {
  touchX = e.touches[0].clientX;
}, { passive: true });

document.querySelector(".galeria").addEventListener("touchend", e => {
  const diff = touchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) diff > 0 ? proximo() : anterior();
});

// Teclado
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") proximo();
  if (e.key === "ArrowLeft")  anterior();
});

// Pausa o autoplay quando a aba fica em background
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(timer);
    progressEl.style.transition = "none";
    progressEl.style.width = "0%";
    // Salva tempo ao esconder
    localStorage.setItem("audioTime", audio.currentTime);
  } else {
    iniciarAutoplay();
    if (!audio.paused) return;
    audio.play().catch(() => {});
  }
});

// Inicia galeria
mostrarImagem(0);
iniciarAutoplay();

/* ══════════════════════════════════════ */
/* ÁUDIO — retoma do ponto onde parou   */
/* ══════════════════════════════════════ */

const audio = new Audio("musica.mp3");
audio.loop = true;

const savedTime = parseFloat(localStorage.getItem("audioTime") || "0");

audio.addEventListener("canplay", () => {
  if (savedTime > 0) audio.currentTime = savedTime;
}, { once: true });

audio.addEventListener("timeupdate", () => {
  localStorage.setItem("audioTime", audio.currentTime);
});

// Toca direto, sem esperar clique
audio.play().catch(() => {
  // Se o navegador bloquear, toca no primeiro clique
  document.addEventListener("click", () => audio.play(), { once: true });
});