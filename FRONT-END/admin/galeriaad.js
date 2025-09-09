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
// ---- Variables globales ----
let albums = JSON.parse(localStorage.getItem("albums")) || [];
let currentAlbumIndex = null;

const albumsDiv = document.getElementById("albums");
const albumView = document.getElementById("album-view");
const albumTitle = document.getElementById("album-title");
const photosDiv = document.getElementById("photos");

// ---- Guardar en localStorage ----
function saveAlbums() {
  localStorage.setItem("albums", JSON.stringify(albums));
}

// ---- Renderizar todos los álbumes ----
function renderAlbums() {
  albumsDiv.innerHTML = "";
  albums.forEach((album, i) => {
    const item = document.createElement("div");
    item.classList.add("album");
    item.innerHTML = `
      <div class="album-info">
        <h3>${album.titulo}</h3>
        <div class="album-actions">
          <button onclick="openAlbum(${i})">📂 Abrir</button>
          <button onclick="editAlbum(${i})">✏️ Editar</button>
          <button onclick="deleteAlbum(${i})">🗑️ Eliminar</button>
        </div>
      </div>
    `;
    albumsDiv.appendChild(item);
  });
}

// ---- Renderizar fotos de un álbum ----
function renderPhotos() {
  photosDiv.innerHTML = "";
  albums[currentAlbumIndex].fotos.forEach((foto, i) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("photo-item");

    const img = document.createElement("img");
    img.src = foto;
    img.alt = `Foto ${i + 1}`;

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-photo-btn");
    delBtn.textContent = "✖";
    delBtn.onclick = () => {
      openModal({
        title: "Eliminar foto",
        message: "¿Seguro que deseas eliminar esta foto?",
        action: () => {
          albums[currentAlbumIndex].fotos.splice(i, 1);
          saveAlbums();
          renderPhotos();
        }
      });
    };

    wrapper.appendChild(img);
    wrapper.appendChild(delBtn);
    photosDiv.appendChild(wrapper);
  });
}

// ---- Modal genérico ----
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalInput = document.getElementById("modal-input");
const modalCancel = document.getElementById("modal-cancel");
const modalConfirm = document.getElementById("modal-confirm");
document.getElementById("crear-album").classList.add("hidden");


let modalAction = null;

function openModal({ title = "", message = "", input = false, defaultValue = "", action }) {
  modalTitle.textContent = title;
  modalMessage.innerHTML = message;

  if (input) {
    modalInput.classList.remove("hidden");
    modalInput.value = defaultValue;
  } else {
    modalInput.classList.add("hidden");
  }

  modal.classList.remove("hidden");
  modalAction = () => action(modalInput.value);
}

modalCancel.addEventListener("click", () => {
  modal.classList.add("hidden");
  modalAction = null;
});

modalConfirm.addEventListener("click", () => {
  if (modalAction) modalAction();
  modal.classList.add("hidden");
  modalAction = null;
});

// ---- Crear nuevo álbum ----
document.getElementById("crear-album").addEventListener("click", () => {
  openModal({
    title: "Nuevo álbum",
    message: "Escribe un título para el nuevo álbum:",
    input: true,
    action: (titulo) => {
      if (titulo.trim()) {
        albums.push({ titulo, fotos: [] });
        saveAlbums();
        renderAlbums();
      }
    }
  });
});

// ---- Abrir álbum ----
// Abrir álbum
function openAlbum(index) {
  openModal({
    title: "Abrir álbum",
    message: `¿Quieres entrar al álbum <b>${albums[index].titulo}</b>?`,
    action: () => {
      currentAlbumIndex = index;
      albumsDiv.parentElement.classList.add("hidden");
      albumView.classList.remove("hidden");
      document.getElementById("crear-album").classList.add("hidden"); // 🔹 ocultar botón
      albumTitle.textContent = albums[index].titulo;
      renderPhotos();
    }
  });
}

// Volver a álbumes
document.getElementById("volver").addEventListener("click", () => {
  albumView.classList.add("hidden");
  albumsDiv.parentElement.classList.remove("hidden");
  document.getElementById("crear-album").classList.remove("hidden"); // 🔹 mostrar de nuevo
  currentAlbumIndex = null;
});

// ---- Editar álbum ----
window.editAlbum = function(index) {
  openModal({
    title: "Editar álbum",
    message: "Cambia el título del álbum:",
    input: true,
    defaultValue: albums[index].titulo,
    action: (nuevoTitulo) => {
      if (nuevoTitulo.trim()) {
        albums[index].titulo = nuevoTitulo;
        saveAlbums();
        renderAlbums();
      }
    }
  });
};

// ---- Eliminar álbum ----
window.deleteAlbum = function(index) {
  openModal({
    title: "Eliminar álbum",
    message: `¿Seguro que deseas eliminar el álbum <b>${albums[index].titulo}</b>?`,
    action: () => {
      albums.splice(index, 1);
      saveAlbums();
      renderAlbums();
      albumView.classList.add("hidden");
      albumsDiv.parentElement.classList.remove("hidden");
    }
  });
};

// ---- Helper: procesa un File, corrige orientación EXIF y devuelve dataURL ----
function fixImageOrientationAndResize(file, maxDim = 1024, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const img = new Image();
    img.onload = function() {
      // EXIF lee la orientación
      EXIF.getData(img, function() {
        const orientation = EXIF.getTag(this, "Orientation") || 1;

        // dimensiones originales y escala para no guardar imágenes gigantes (ajusta maxDim si quieres miniaturas)
        const origW = img.width;
        const origH = img.height;
        const scale = Math.min(1, maxDim / Math.max(origW, origH));
        const destW = Math.round(origW * scale);
        const destH = Math.round(origH * scale);

        // Si la orientación implica rotación 90/270, intercambiamos destino
        let outW = destW;
        let outH = destH;
        if (orientation >= 5 && orientation <= 8) {
          outW = destH;
          outH = destW;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = outW;
        canvas.height = outH;

        // Aplica transformaciones según orientación (basado en patrón común)
        switch (orientation) {
          case 2: // flip horizontal
            ctx.translate(outW, 0);
            ctx.scale(-1, 1);
            break;
          case 3: // rotate 180
            ctx.translate(outW, outH);
            ctx.rotate(Math.PI);
            break;
          case 4: // flip vertical
            ctx.translate(0, outH);
            ctx.scale(1, -1);
            break;
          case 5: // transpose
            ctx.rotate(0.5 * Math.PI);
            ctx.scale(1, -1);
            break;
          case 6: // rotate 90
            ctx.translate(outW, 0);
            ctx.rotate(0.5 * Math.PI);
            break;
          case 7: // transverse
            ctx.translate(outW, 0);
            ctx.rotate(0.5 * Math.PI);
            ctx.scale(1, -1);
            break;
          case 8: // rotate -90
            ctx.translate(0, outH);
            ctx.rotate(-0.5 * Math.PI);
            break;
          default:
            // orientation 1 -> no transform
            break;
        }

        // Dibuja la imagen escalada en el canvas (si hubo rotación, destW/destH siguen representando la escala)
        ctx.drawImage(img, 0, 0, origW, origH, 0, 0, destW, destH);

        const fixedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        callback(fixedDataUrl);
      });
    };
    img.src = dataUrl;
  };
  reader.readAsDataURL(file);
}

// ---- Nuevo listener para add-photo (usa la función anterior) ----
document.getElementById("add-photo").addEventListener("change", (e) => {
  const files = Array.from(e.target.files || []);
  if (files.length > 0 && currentAlbumIndex !== null) {
    // procesa cada archivo (asíncrono, pero guardamos cada resultado cuando esté listo)
    files.forEach((file) => {
      fixImageOrientationAndResize(file, 1024, (fixedDataUrl) => {
        albums[currentAlbumIndex].fotos.push(fixedDataUrl);
        saveAlbums();
        renderPhotos();
      });
    });
  }
  // limpia el input para poder subir mismo archivo otra vez si hace falta
  e.target.value = "";
});

// ---- Volver a lista de álbumes ----
document.getElementById("crear-album").classList.remove("hidden");
document.getElementById("volver").addEventListener("click", () => {
  albumView.classList.add("hidden");
  albumsDiv.parentElement.classList.remove("hidden");
  currentAlbumIndex = null;
});

// ---- Inicializar ----
renderAlbums();


