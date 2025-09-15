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
      
      if (albums.length === 0) {
        albumsDiv.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-images"></i>
            <h3>No hay álbumes creados</h3>
            <p>Crea tu primer álbum para comenzar a organizar tus fotos.</p>
          </div>`;
        return;
      }
      
      albums.forEach((album, i) => {
        const item = document.createElement("div");
        item.classList.add("album");
        
        const thumbnail = album.fotos.length > 0 
          ? `<img src="${album.fotos[0]}" alt="${album.titulo}">`
          : `<i class="fas fa-image"></i>`;
        
        item.innerHTML = `
          <div class="album-thumbnail">
            ${thumbnail}
          </div>
          <div class="album-info">
            <h3>${album.titulo}</h3>
            <p class="photo-count">${album.fotos.length} foto(s)</p>
            <div class="album-actions">
              <button onclick="openAlbum(${i})"><i class="fas fa-folder-open"></i> Abrir</button>
              <button onclick="editAlbum(${i})"><i class="fas fa-edit"></i> Editar</button>
              <button onclick="deleteAlbum(${i})"><i class="fas fa-trash"></i> Eliminar</button>
            </div>
          </div>
        `;
        albumsDiv.appendChild(item);
      });
    }

    // ---- Renderizar fotos de un álbum ----
    function renderPhotos() {
      photosDiv.innerHTML = "";
      
      if (albums[currentAlbumIndex].fotos.length === 0) {
        photosDiv.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-camera"></i>
            <h3>No hay fotos en este álbum</h3>
            <p>Añade fotos usando el botón "Añadir fotos".</p>
          </div>`;
        return;
      }
      
      albums[currentAlbumIndex].fotos.forEach((foto, i) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("photo-item");

        const img = document.createElement("img");
        img.src = foto;
        img.alt = `Foto ${i + 1}`;

        const delBtn = document.createElement("button");
        delBtn.classList.add("delete-photo-btn");
        delBtn.innerHTML = "<i class='fas fa-times'></i>";
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
        action: (titulo) => {
          if (titulo.trim()) {
            albums.push({ titulo: titulo.trim(), fotos: [] });
            saveAlbums();
            renderAlbums();
          }
        }
      });
    });

    // ---- Abrir álbum ----
    window.openAlbum = function(index) {
      openModal({
        title: "Abrir álbum",
        message: `¿Quieres entrar al álbum <b>${albums[index].titulo}</b>?`,
        action: () => {
          currentAlbumIndex = index;
          albumsDiv.parentElement.classList.add("hidden");
          albumView.classList.remove("hidden");
          document.getElementById("crear-album").classList.add("hidden");
          albumTitle.textContent = albums[index].titulo;
          renderPhotos();
        }
      });
    };

    // ---- Volver a álbumes ----
    document.getElementById("volver").addEventListener("click", () => {
      albumView.classList.add("hidden");
      albumsDiv.parentElement.classList.remove("hidden");
      document.getElementById("crear-album").classList.remove("hidden");
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
            albums[index].titulo = nuevoTitulo.trim();
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
        message: `¿Seguro que deseas eliminar el álbum <b>${albums[index].titulo}</b>? Esta acción no se puede deshacer.`,
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
          EXIF.getData(img, function() {
            const orientation = EXIF.getTag(this, "Orientation") || 1;
            const origW = img.width;
            const origH = img.height;
            const scale = Math.min(1, maxDim / Math.max(origW, origH));
            const destW = Math.round(origW * scale);
            const destH = Math.round(origH * scale);

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

            switch (orientation) {
              case 2:
                ctx.translate(outW, 0);
                ctx.scale(-1, 1);
                break;
              case 3:
                ctx.translate(outW, outH);
                ctx.rotate(Math.PI);
                break;
              case 4:
                ctx.translate(0, outH);
                ctx.scale(1, -1);
                break;
              case 5:
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(1, -1);
                break;
              case 6:
                ctx.translate(outW, 0);
                ctx.rotate(0.5 * Math.PI);
                break;
              case 7:
                ctx.translate(outW, 0);
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(1, -1);
                break;
              case 8:
                ctx.translate(0, outH);
                ctx.rotate(-0.5 * Math.PI);
                break;
            }

            ctx.drawImage(img, 0, 0, origW, origH, 0, 0, destW, destH);
            const fixedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
            callback(fixedDataUrl);
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }

    // ---- Nuevo listener para add-photo ----
    document.getElementById("add-photo").addEventListener("change", (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0 && currentAlbumIndex !== null) {
        files.forEach((file) => {
          fixImageOrientationAndResize(file, 1024, (fixedDataUrl) => {
            albums[currentAlbumIndex].fotos.push(fixedDataUrl);
            saveAlbums();
            renderPhotos();
          });
        });
      }
      e.target.value = "";
    });

    // ---- Inicializar ----
    document.addEventListener("DOMContentLoaded", function() {
      renderAlbums();
      
      // Configurar menú de usuario
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
    });


