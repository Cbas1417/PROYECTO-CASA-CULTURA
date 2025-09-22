// ================== GALERÍA ==================
const API_BASE_URL = "https://tu-backend.com/api";

const albumsContainer = document.getElementById("albums-container");
const loadingElement = document.getElementById("loading");
const albumsDiv = document.getElementById("albums");
const albumView = document.getElementById("album-view");
const albumTitle = document.getElementById("album-title");
const photosDiv = document.getElementById("photos");
const volverBtn = document.getElementById("volver");
const imageModal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const modalClose = document.querySelector(".modal-close");

let currentAlbum = null;

function showLoading() {
  loadingElement.classList.remove("hidden");
}
function hideLoading() {
  loadingElement.classList.add("hidden");
}
function showError(message) {
  albumsDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error</h3>
        <p>${message}</p>
        <button id="retry-btn" style="margin-top:15px;">Reintentar</button>
      </div>`;
  document.getElementById("retry-btn").addEventListener("click", loadAlbums);
}

// ================== RENDERIZAR ÁLBUMES ==================
function renderAlbums(albums) {
  albumsDiv.innerHTML = "";
  if (!albums || albums.length === 0) {
    albumsDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-images"></i>
        <h3>No hay álbumes disponibles</h3>
        <p>Pronto tendremos nuevos álbumes para ti.</p>
      </div>`;
    return;
  }

  albums.forEach((album) => {
    const el = document.createElement("div");
    el.classList.add("album");

    const thumb = album.portada
      ? `<img src="${album.portada}" alt="${album.titulo}">`
      : `<i class="fas fa-image"></i>`;

    el.innerHTML = `
      <div class="album-thumbnail">${thumb}</div>
      <div class="album-info">
        <h3>${album.titulo}</h3>
        <p>${album.total_fotos} foto(s)</p>
      </div>`;
    el.addEventListener("click", () => openAlbum(album));
    albumsDiv.appendChild(el);
  });
}

// ================== CARGAR ÁLBUMES ==================
function loadAlbums() {
  axios.get("http://127.0.0.1:8000/api/v1/album/")
    .then(response => {
      console.log("📦 Datos del backend:", response.data);

      const albums = Array.isArray(response.data)
        ? response.data
        : response.data.data;   // <- tu backend devuelve { data: [...] }

      renderAlbums(albums);
      hideLoading();     
    })
    .catch(error => {
      console.error("❌ Error al cargar álbumes:", error);

      albumsDiv.innerHTML = `
        <div class="error-state">
          <h3>Error</h3>
          <p>No se pudieron cargar los álbumes.</p>
          <button onclick="loadAlbums()">Reintentar</button>
        </div>
      `;
    });
}

// Ejecutar cuando cargue la página
document.addEventListener("DOMContentLoaded", loadAlbums);

function openAlbum(album) {
  currentAlbum = album;
  albumsContainer.classList.add("hidden");
  albumView.classList.remove("hidden");
  albumTitle.textContent = album.titulo;

  // 🚀 Pedir las fotos del álbum
  axios.get(`http://127.0.0.1:8000/api/v1/fotos/?album=${album.id}`)
    .then(response => {
      console.log("📷 Fotos del álbum:", response.data);

      // Extraer solo las URLs de imagen
      const photos = response.data.data.map(f => f.imagen);
      renderPhotos(photos);
    })
    .catch(error => {
      console.error("❌ Error al cargar fotos:", error);
      photosDiv.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-camera"></i>
          <h3>Error al cargar fotos</h3>
        </div>`;
    });
}
function renderPhotos(photos) {
  photosDiv.innerHTML = "";
  if (!photos || photos.length === 0) {
    photosDiv.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-camera"></i>
          <h3>No hay fotos en este álbum</h3>
        </div>`;
    return;
  }
  photos.forEach((src) => {
    const div = document.createElement("div");
    div.classList.add("photo-item");
    div.innerHTML = `<img src="${src}" alt="Foto">`;
    div.addEventListener("click", () => openModal(src));
    photosDiv.appendChild(div);
  });
}

function openModal(src) {
  modalImage.src = src;
  imageModal.classList.remove("hidden");
}

// ================== EVENTOS GENERALES ==================
volverBtn.addEventListener("click", () => {
  albumView.classList.add("hidden");
  albumsContainer.classList.remove("hidden");
});
modalClose.addEventListener("click", () => imageModal.classList.add("hidden"));
imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) imageModal.classList.add("hidden");
});

// ================== MENÚ Y USUARIO ==================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => menu.classList.toggle("active"));
  }

  const btnIniciar = document.getElementById("btn-iniciar");
  const btnRegistrar = document.getElementById("btn-registrar");
  const perfil = document.getElementById("perfil-icono");
  const drop = document.getElementById("dropdown-menu");
  const cerrar = document.getElementById("cerrar-sesion");

  const logueado = sessionStorage.getItem("usuarioLogueado") === "true";
  if (logueado) {
    if (btnIniciar) btnIniciar.style.display = "none";
    if (btnRegistrar) btnRegistrar.style.display = "none";
    if (perfil) perfil.style.display = "inline-block";
  } else {
    if (btnIniciar) btnIniciar.style.display = "inline-block";
    if (btnRegistrar) btnRegistrar.style.display = "inline-block";
    if (perfil) perfil.style.display = "none";
  }

  if (perfil && drop) {
    perfil.addEventListener("click", (e) => {
      e.stopPropagation();
      drop.classList.toggle("hidden");
    });
    document.addEventListener("click", () => drop.classList.add("hidden"));
  }

  if (cerrar) {
    cerrar.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "programas.html";
    });
  }

  if (btnRegistrar) {
    btnRegistrar.addEventListener("click", () =>
      sessionStorage.setItem("paginaAnterior", window.location.href)
    );
  }
});

// ================== INICIAL ==================
document.addEventListener("DOMContentLoaded", loadAlbums);
