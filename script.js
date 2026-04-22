/* ══════════════════════════════════════ */
/* CONFIGURAÇÃO DAS CENAS               */
/* ══════════════════════════════════════ */

const cenas = [
  { texto: "Oi, meu amor, passando aqui pra te falar, que...", 
    imagens: ["imagens/parksp.jpg"], 
    tempo: 3800 
  },
    
  { texto: "Hoje é um dia muito especial.", 
    imagens: ["imagens/outbaack.jpg"], 
    tempo: 3800 
  },
  {
    texto: "Porque é o dia da pessoa mais importante da minha vida.",
    imagens: ["imagens/b-hotel.jpg", "imagens/b-hotel2.jpg"],
    tempo: 4500
  },
  {
    texto: "Cada momento com você é único e perfeito.",
    imagens: ["imagens/rio.jpg", "imagens/royal.jpg"],
    tempo: 4500
  },
  {
    texto: "Seu sorriso tem o poder de mudar qualquer dia.",
    imagens: ["imagens/rio.jpg"],
    tempo: 3500
  },
  { texto: "E eu só queria te lembrar de uma coisa...", 
    imagens: ["imagens/royal2.jpg"], 
    tempo: 3000 
  },
  {
    texto: "Eu te amo muito. De verdade.",
    imagens: ["imagens/royal.jpg", "imagens/b-hotel.jpg"],
    tempo: 4500
  },
  { texto: "Feliz aniversário, meu amor. ♥", 
    imagens: ["imagens/liberta.jpeg"], 
    tempo: 3500 
  }
];

/* ══════════════════════════════════════ */
/* ESTADO                               */
/* ══════════════════════════════════════ */

let index = 0;
let digitando = false;
let transicionando = false;
let slideInterval = null;
let autoplayTimer = null;
let iniciou = false;

const audio = new Audio("musica.mp3");
audio.loop = true;

// Salva o tempo atual do áudio constantemente
audio.addEventListener("timeupdate", () => {
  localStorage.setItem("audioTime", audio.currentTime);
  localStorage.setItem("audioPlaying", "true");
});

/* ══════════════════════════════════════ */
/* INICIAR                              */
/* ══════════════════════════════════════ */

function iniciar() {
  const intro = document.getElementById("intro");
  const conteudo = document.getElementById("conteudo");
  const card = document.getElementById("card");

  intro.classList.add("hide");

  setTimeout(() => {
    intro.style.display = "none";
    conteudo.style.display = "flex";
    setTimeout(() => card.classList.add("visible"), 30);
  }, 900);

  if (!iniciou) {
    audio.play().catch(() => {});
    iniciou = true;
  }

  criarDots();
  proximaCena();
}

/* ══════════════════════════════════════ */
/* DOTS INDICADORES                     */
/* ══════════════════════════════════════ */

function criarDots() {
  const dotsEl = document.getElementById("dots");
  cenas.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " active" : "");
    dotsEl.appendChild(d);
  });
}

function atualizarDots() {
  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("active", i === index - 1);
  });
}

/* ══════════════════════════════════════ */
/* BARRA DE PROGRESSO                   */
/* ══════════════════════════════════════ */

function atualizarProgresso() {
  const pct = Math.round((index / cenas.length) * 100);
  document.getElementById("progressFill").style.width = pct + "%";
}

/* ══════════════════════════════════════ */
/* DIGITAÇÃO                            */
/* ══════════════════════════════════════ */

function digitarTexto(texto, el) {
  el.innerHTML = "";
  digitando = true;
  let i = 0;

  const iv = setInterval(() => {
    if (i < texto.length) {
      el.textContent += texto[i++];
    } else {
      clearInterval(iv);
      digitando = false;
    }
  }, 28);
}

/* ══════════════════════════════════════ */
/* PRÓXIMA CENA                         */
/* ══════════════════════════════════════ */

function proximaCena() {
  if (transicionando) return;

  if (index >= cenas.length) {
    encerrar();
    return;
  }

  const cena = cenas[index++];
  const textoEl = document.getElementById("texto");
  const imgEl = document.getElementById("imagem");
  const placeholder = document.getElementById("imgPlaceholder");

  clearAutoplay();
  transicionando = true;

  textoEl.style.opacity = "0";
  triggerFlash();

  setTimeout(() => {
    digitarTexto(cena.texto, textoEl);
    textoEl.style.opacity = "1";
    atualizarProgresso();
    atualizarDots();

    /* ── Imagens / Slides ── */
    clearInterval(slideInterval);

    if (cena.imagens.length > 0) {
      placeholder.style.display = "none";
      let si = 0;

      const trocarImagem = () => {
        imgEl.classList.remove("show");
        setTimeout(() => {
          imgEl.src = cena.imagens[si % cena.imagens.length];
          imgEl.onload  = () => imgEl.classList.add("show");
          imgEl.onerror = () => {
            imgEl.classList.remove("show");
            placeholder.style.display = "flex";
          };
          si++;
        }, 300);
      };

      trocarImagem();
      if (cena.imagens.length > 1) {
        slideInterval = setInterval(trocarImagem, 2000);
      }

    } else {
      imgEl.classList.remove("show");
      placeholder.style.display = "flex";
    }

    transicionando = false;
    autoplayTimer = setTimeout(proximaCena, cena.tempo);

  }, 480);
}

/* ══════════════════════════════════════ */
/* ENCERRAR — exibir carta final        */
/* ══════════════════════════════════════ */

function encerrar() {
  const conteudo = document.getElementById("conteudo");
  const carta = document.getElementById("carta-container");
  const card = document.getElementById("card");

  card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  card.style.opacity = "0";
  card.style.transform = "scale(0.9) translateY(20px)";

  setTimeout(() => {
    conteudo.style.display = "none";

    carta.style.display = "flex";
    carta.style.opacity = "0";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        carta.style.transition = "opacity 1s ease";
        carta.style.opacity = "1";
        carta.classList.add("visible");

        for (let i = 0; i < 15; i++) {
          setTimeout(() => emitirCoracao(true), i * 80);
        }
      });
    });
  }, 550);
}


/* ══════════════════════════════════════ */
/* VOLTAR AO INÍCIO                     */
/* ══════════════════════════════════════ */

function voltarInicio() {
  // Parar tudo
  clearAutoplay();
  clearInterval(slideInterval);
  audio.pause();
  audio.currentTime = 0;

  // Limpar áudio salvo no localStorage
  localStorage.removeItem("audioTime");
  localStorage.removeItem("audioPlaying");

  // Resetar estado
  index = 0;
  digitando = false;
  transicionando = false;
  iniciou = false;

  // Esconder conteúdo e carta
  const conteudo = document.getElementById("conteudo");
  const carta = document.getElementById("carta-container");
  const card = document.getElementById("card");
  const envelope = document.getElementById("envelope");

  conteudo.style.display = "none";
  carta.style.display = "none";
  carta.style.opacity = "0";

  // Resetar card
  card.classList.remove("visible");
  card.style.opacity = "";
  card.style.transform = "";

  // Resetar envelope
  envelope.classList.remove("aberto");

  // Resetar imagem e texto
  document.getElementById("imagem").classList.remove("show");
  document.getElementById("imagem").src = "";
  document.getElementById("imgPlaceholder").style.display = "flex";
  document.getElementById("texto").textContent = "";
  document.getElementById("progressFill").style.width = "0%";

  // Resetar dots
  const dotsEl = document.getElementById("dots");
  dotsEl.innerHTML = "";

  // Mostrar intro
  const intro = document.getElementById("intro");
  intro.style.display = "flex";
  intro.classList.remove("hide");
}

/* ══════════════════════════════════════ */
/* ABRIR CARTA                          */
/* ══════════════════════════════════════ */

function abrirCarta() {
  const env = document.getElementById("envelope");
  const botao = document.getElementById("btnPresente");
  alert("CLIQUE NO VER PRESENTE !!")

  if (env.classList.contains("aberto")) return;
  env.classList.add("aberto");

  for (let i = 0; i < 20; i++) {
    setTimeout(() => emitirCoracao(true), i * 60);
  }

  if (botao) {
    botao.style.display = "block";
    setTimeout(() => { botao.style.opacity = "1"; }, 100);
  }
}

/* ══════════════════════════════════════ */
/* CORAÇÕES FLUTUANTES                  */
/* ══════════════════════════════════════ */

function emitirCoracao(fixed = false) {
  const h = document.createElement("div");
  h.className = "heart-float";
  h.innerHTML = ["♥", "♡", "✦"][Math.floor(Math.random() * 3)];
  h.style.left     = (10 + Math.random() * 80) + "vw";
  h.style.bottom   = fixed ? "10vh" : "15vh";
  h.style.fontSize = (0.8 + Math.random() * 0.9) + "rem";
  h.style.color    = `hsl(${340 + Math.random() * 20}, ${70 + Math.random() * 20}%, ${60 + Math.random() * 20}%)`;
  h.style.animationDuration = (2 + Math.random() * 1.2) + "s";
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 3600);
}

/* ══════════════════════════════════════ */
/* FLASH DE TRANSIÇÃO                   */
/* ══════════════════════════════════════ */

function triggerFlash() {
  const f = document.getElementById("flash");
  f.style.opacity = "0.25";
  setTimeout(() => f.style.opacity = "0", 200);
}

/* ══════════════════════════════════════ */
/* HELPERS                              */
/* ══════════════════════════════════════ */

function clearAutoplay() {
  if (autoplayTimer) {
    clearTimeout(autoplayTimer);
    autoplayTimer = null;
  }
}

/* Tap no card (fora dos botões) também avança */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("card").addEventListener("click", (e) => {
    if (!e.target.closest("button")) proximaCena();
  });
});

/* ══════════════════════════════════════ */
/* PARTÍCULAS (canvas)                  */
/* ══════════════════════════════════════ */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() { this.reset(true); }

  reset(init = false) {
    this.x       = Math.random() * canvas.width;
    this.y       = init ? Math.random() * canvas.height : canvas.height + 10;
    this.r       = 1 + Math.random() * 2.5;
    this.vy      = -(0.3 + Math.random() * 0.8);
    this.vx      = (Math.random() - 0.5) * 0.3;
    this.opacity = 0.15 + Math.random() * 0.45;
    this.hue     = 340 + Math.random() * 20;
  }

  update() {
    this.y += this.vy;
    this.x += this.vx;
    if (this.y < -10) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 70%, 75%, ${this.opacity})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: 80 }, () => new Particle());

(function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(loop);
})();