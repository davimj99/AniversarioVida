let index = 0;
const imagens = document.querySelectorAll(".galeria img");

function mostrarImagem(i) {
  imagens.forEach(img => img.classList.remove("ativa"));

  setTimeout(() => {
    imagens[i].classList.add("ativa");
  }, 100);
}

function proximo() {
  index = (index + 1) % imagens.length;
  mostrarImagem(index);
}

function anterior() {
  index = (index - 1 + imagens.length) % imagens.length;
  mostrarImagem(index);
}

function voltar() {
  window.location.href = "index.html";
}

// autoplay estilo cinematic
setInterval(proximo, 5000);