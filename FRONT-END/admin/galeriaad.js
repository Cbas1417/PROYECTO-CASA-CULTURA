// Prevenir el envío del formulario
document.getElementById("upload-form").addEventListener("submit", (e) => {
  e.preventDefault();
});

// ---- Variables globales ----
let albums = [];
let currentAlbum = null;

const albumsDiv = document.getElementById("albums");
const albumView = document.getElementById("album-view");
const albumTitle = document.getElementById("album-title");
const photosDiv = document.getElementById("photos");

// ---- API Base ----
const API_BASE = "http://127.0.0.1:8000/api/v1";

// ---- Obtener álbumes desde backend ----
async function fetchAlbums() {
  try {
    const res = await axios.get(`${API_BASE}/album/`);
    albums = res.data.data || [];
    renderAlbums();
  } catch (err) {
    console.error("Error obteniendo álbumes:", err);
    showError("No se pudieron cargar los álbumes. Verifica la conexión.");
  }
}

// ---- Mostrar error ----
function showError(message) {
  // Puedes implementar un sistema de notificación de errores más elegante
  console.error(message);
  alert(message);
}

// ---- Renderizar todos los álbumes ----
function renderAlbums() {
  albumsDiv.innerHTML = "";

  if (albums.length === 0) {
    albumsDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-images"></i>
        <h3>No hay álbumes creados</h3>
        <p>Crea tu primer álbum para comenzar a organizar tus fotos.</p>
      </div>`;
    return;
  }

  albums.forEach((album) => {
    const item = document.createElement("div");
    item.classList.add("album");

    const thumbnail = album.fotos && album.fotos.length > 0
      ? `<img src="${album.fotos[0].imagen}" alt="${album.titulo}">`
      : `<i class="fas fa-image"></i>`;

    item.innerHTML = `
      <div class="album-thumbnail">${thumbnail}</div>
      <div class="album-info">
        <h3>${album.titulo}</h3>
        <p class="photo-count">${album.fotos ? album.fotos.length : 0} foto(s)</p>
        <div class="album-actions">
          <button onclick="openAlbum(${album.id})"><i class="fas fa-folder-open"></i> Abrir</button>
          <button onclick="editAlbum(${album.id}, '${album.titulo.replace(/'/g, "\\'")}')"><i class="fas fa-edit"></i> Editar</button>
          <button onclick="deleteAlbum(${album.id})"><i class="fas fa-trash"></i> Eliminar</button>
        </div>
      </div>`;
    albumsDiv.appendChild(item);
  });
}

// ---- Renderizar fotos de un álbum ----
async function renderPhotos(albumId) {
  photosDiv.innerHTML = "<div class='loading'><i class='fas fa-spinner fa-spin'></i><p>Cargando fotos...</p></div>";

  try {
    // 🔹 Traer solo las fotos del álbum actual
    const res = await axios.get(`${API_BASE}/fotos/?album=${albumId}`);
    const fotos = res.data.data || [];

    if (fotos.length === 0) {
      photosDiv.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-camera"></i>
          <h3>No hay fotos en este álbum</h3>
          <p>Añade fotos usando el botón "Añadir fotos".</p>
        </div>`;
      return;
    }

    photosDiv.innerHTML = "";
    
    fotos.forEach((foto) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("photo-item");

      const img = document.createElement("img");
      img.src = foto.imagen;
      img.alt = `Foto ${foto.id}`;

      const delBtn = document.createElement("button");
      delBtn.classList.add("delete-photo-btn");
      delBtn.innerHTML = "<i class='fas fa-times'></i>";
      delBtn.onclick = () => {
        openModal({
          title: "Eliminar foto",
          message: "¿Seguro que deseas eliminar esta foto?",
          action: async () => {
            try {
              await axios.delete(`${API_BASE}/fotos/${foto.id}/`);
              renderPhotos(albumId);
            } catch (err) {
              console.error("Error eliminando foto:", err);
              showError("No se pudo eliminar la foto.");
            }
          }
        });
      };

      wrapper.appendChild(img);
      wrapper.appendChild(delBtn);
      photosDiv.appendChild(wrapper);
    });
  } catch (err) {
    console.error("Error obteniendo fotos:", err);
    photosDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error al cargar las fotos</h3>
        <p>Intenta nuevamente más tarde.</p>
      </div>`;
  }
}

// ---- Modal genérico ----
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalInput = document.getElementById("modal-input");
const modalCancel = document.getElementById("modal-cancel");
const modalConfirm = document.getElementById("modal-confirm");

let modalAction = null;

function openModal({ title = "", message = "", input = false, defaultValue = "", action }) {
  modalTitle.textContent = title;
  modalMessage.innerHTML = message;

  if (input) {
    modalInput.classList.remove("hidden");
    modalInput.value = defaultValue;
    modalInput.focus();
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
    action: async (titulo) => {
      if (titulo.trim()) {
        try {
          await axios.post(`${API_BASE}/album/`, { titulo: titulo.trim() });
          fetchAlbums();
        } catch (err) {
          console.error("Error creando álbum:", err);
          showError("No se pudo crear el álbum.");
        }
      }
    }
  });
});

// ---- Abrir álbum ----
window.openAlbum = function (id) {
  const album = albums.find(a => a.id === id);
  if (!album) return;
  
  openModal({
    title: "Abrir álbum",
    message: `¿Quieres entrar al álbum <b>${album.titulo}</b>?`,
    action: () => {
      currentAlbum = id;
      albumsDiv.parentElement.classList.add("hidden");
      albumView.classList.remove("hidden");
      document.getElementById("crear-album").classList.add("hidden");
      albumTitle.textContent = album.titulo;
      renderPhotos(id);
    }
  });
};

// ---- Volver a álbumes ----
document.getElementById("volver").addEventListener("click", () => {
  albumView.classList.add("hidden");
  albumsDiv.parentElement.classList.remove("hidden");
  document.getElementById("crear-album").classList.remove("hidden");
  currentAlbum = null;
});

// ---- Editar álbum ----
window.editAlbum = function (id, tituloActual) {
  openModal({
    title: "Editar álbum",
    message: "Cambia el título del álbum:",
    input: true,
    defaultValue: tituloActual,
    action: async (nuevoTitulo) => {
      if (nuevoTitulo.trim()) {
        try {
          await axios.put(`${API_BASE}/album/${id}/`, { titulo: nuevoTitulo.trim() });
          fetchAlbums();
        } catch (err) {
          console.error("Error editando álbum:", err);
          showError("No se pudo editar el álbum.");
        }
      }
    }
  });
};

// ---- Eliminar álbum ----
window.deleteAlbum = function (id) {
  openModal({
    title: "Eliminar álbum",
    message: `¿Seguro que deseas eliminar este álbum? Esta acción no se puede deshacer.`,
    action: async () => {
      try {
        await axios.delete(`${API_BASE}/album/${id}/`);
        fetchAlbums();
        albumView.classList.add("hidden");
        albumsDiv.parentElement.classList.remove("hidden");
      } catch (err) {
        console.error("Error eliminando álbum:", err);
        showError("No se pudo eliminar el álbum.");
      }
    }
  });
};

// ---- Subir fotos ----
document.getElementById("add-photo").addEventListener("change", async (e) => {
  e.preventDefault();
  e.stopPropagation();

  const files = Array.from(e.target.files || []);
  if (files.length > 0 && currentAlbum !== null) {
    // Modal de progreso
    const progressModal = document.createElement("div");
    progressModal.className = "modal";
    progressModal.innerHTML = `
      <div class="modal-content">
        <h3>Subiendo fotos</h3>
        <p id="modal-message">Procesando 0 de ${files.length} imágenes...</p>
        <div style="background: #f0f0f0; border-radius: 8px; height: 20px; margin: 20px 0;">
          <div id="progress-bar" style="background: linear-gradient(135deg, #FF9015, #FF7020); height: 100%; width: 0%; border-radius: 8px; transition: width 0.3s ease;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(progressModal);

    let uploaded = 0;
    let errors = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append("album", currentAlbum);
      formData.append("imagen", file);

      try {
        await axios.post(`${API_BASE}/fotos/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploaded++;
      } catch (err) {
        errors++;
        if (err.response) {
          console.error("❌ Error subiendo foto:", err.response.data);
          alert("Error del servidor: " + JSON.stringify(err.response.data));
        } else {
          console.error("❌ Error subiendo foto:", err);
          alert("Error desconocido al subir la foto.");
        }
      }

      // Actualizar progreso
      const progress = ((uploaded + errors) / files.length) * 100;
      const progressBar = document.getElementById("progress-bar");
      const message = document.querySelector("#modal-message");

      if (progressBar) progressBar.style.width = `${progress}%`;
      if (message) message.textContent = `Procesando ${uploaded + errors} de ${files.length} imágenes...`;
    }

    // Cerrar modal
    document.body.removeChild(progressModal);

    // Resultado final
    if (errors > 0) {
      alert(`Se subieron ${uploaded} de ${files.length} imágenes. ${errors} fallaron.`);
    }

    // Recargar fotos
    renderPhotos(currentAlbum);
  }

  // Resetear input
  e.target.value = "";
});

// ---- Inicializar ----
document.addEventListener("DOMContentLoaded", function () {
  fetchAlbums();

  // Menú de usuario
  const perfilImg = document.getElementById("perfil-img");
  const dropdownMenu = document.getElementById("dropdown-menu");
  if (perfilImg && dropdownMenu) {
    perfilImg.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest('.perfil-dropdown')) {
        dropdownMenu.classList.add("hidden");
      }
    });
  }

  // Menú adaptable
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }

  // Prevenir envío de formularios por defecto
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  });
});

// Capturar todos los errores no manejados
window.addEventListener('error', function(e) {
  console.error('Error capturado:', e.error);
  alert('Error: ' + e.error.message);
});

// También capturar promesas rechazadas no manejadas
window.addEventListener('unhandledrejection', function(e) {
  console.error('Promesa rechazada:', e.reason);
  alert('Error de promesa: ' + e.reason);
});