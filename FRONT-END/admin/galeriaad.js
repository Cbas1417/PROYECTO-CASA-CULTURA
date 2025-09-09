/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const perfilIcono = document.getElementById("perfil-icono");
  const perfilImg = document.getElementById("perfil-img");
  const dropdownMenu = document.getElementById("dropdown-menu");

  if (perfilImg && dropdownMenu) {
    // Mostrar / ocultar menú
    perfilImg.addEventListener("click", (e) => {
      e.stopPropagation(); // evita cierre inmediato
      dropdownMenu.classList.toggle("hidden");
    });

    // Cerrar si se hace clic fuera
    document.addEventListener("click", (e) => {
      if (!perfilIcono.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });
  }
});

//galeria
const form = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");
const titleInput = document.getElementById("title-input");
const gallery = document.getElementById("gallery");

// Recuperar fotos guardadas en LocalStorage
let fotos = JSON.parse(localStorage.getItem("fotos")) || [];

// Renderizar galería
function renderGallery() {
  gallery.innerHTML = "";
  fotos.forEach((foto, index) => {
    const item = document.createElement("div");
    item.classList.add("gallery-item");
    item.innerHTML = `
      <img src="${foto.url}" alt="${foto.titulo}">
      <div class="info">
        <h3>${foto.titulo}</h3>
        <div class="actions">
          <button onclick="editFoto(${index})">✏️</button>
          <button onclick="deleteFoto(${index})">🗑️</button>
        </div>
      </div>
    `;
    gallery.appendChild(item);
  });
}

// Subir nueva foto
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  const titulo = titleInput.value;

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const nuevaFoto = {
      titulo,
      url: event.target.result,
    };
    fotos.push(nuevaFoto);
    localStorage.setItem("fotos", JSON.stringify(fotos));
    renderGallery();
    form.reset();
  };
  reader.readAsDataURL(file);
});

// Editar foto
window.editFoto = function(index) {
  const nuevoTitulo = prompt("Nuevo título:", fotos[index].titulo);
  if (nuevoTitulo !== null) {
    fotos[index].titulo = nuevoTitulo;
    localStorage.setItem("fotos", JSON.stringify(fotos));
    renderGallery();
  }
};

// Eliminar foto
window.deleteFoto = function(index) {
  if (confirm("¿Eliminar esta foto?")) {
    fotos.splice(index, 1);
    localStorage.setItem("fotos", JSON.stringify(fotos));
    renderGallery();
  }
};

// Inicializar
renderGallery();
