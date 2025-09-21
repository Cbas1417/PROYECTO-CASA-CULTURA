
// ================== GALERÍA ==================
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
    albumsDiv.innerHTML = '';
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
            <button id="retry-btn" style="margin-top:15px; padding:10px 20px; background:#FF9015; color:white; border:none; border-radius:5px; cursor:pointer;">Reintentar</button>
        </div>`;
    document.getElementById("retry-btn").addEventListener("click", loadAlbums);
}

function loadAlbums() {
    try {
        showLoading();
        
        // Simular carga de datos (reemplazar con API real)
        setTimeout(() => {
            const albums = [
                {
                    id: 1,
                    title: "Festival de Arte 2023",
                    photos: [
                        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
                        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80"
                    ],
                    createdAt: "2023-05-15"
                },
                {
                    id: 2,
                    title: "Talleres Culturales",
                    photos: [
                        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1 600&h=400&q=80",
                        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=400&q=80"
                    ],
                    createdAt: "2023-06-22"
                },
                {
                    id: 3,
                    title: "Exposición Pictórica",
                    photos: [
                        "../imagenes/caldas.jpg",
                        "https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=400&q=80",
                        "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=400&q=80"
                    ],
                    createdAt: "2023-07-10"
                }
            ];
            
            hideLoading();
            renderAlbums(albums);
        }, 1000);
    } catch (e) {
        hideLoading();
        showError("No se pudieron cargar los álbumes.");
    }
}

function renderAlbums(albums) {
    albumsDiv.innerHTML = "";
    
    if (albums.length === 0) {
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
        
        const thumb = album.photos.length > 0 ? 
            `<img src="${album.photos[0]}" alt="${album.title}">` : 
            `<div style="display:flex; align-items:center; justify-content:center; height:100%;"><i class="fas fa-image" style="font-size:3rem; color:#ccc;"></i></div>`;
        
        el.innerHTML = `
            <div class="album-thumbnail">${thumb}</div>
            <div class="album-info">
                <h3>${album.title}</h3>
                <p>${album.photos.length} foto(s)</p>
            </div>`;
        
        el.addEventListener("click", () => openAlbum(album));
        albumsDiv.appendChild(el);
    });
}

function openAlbum(album) {
    currentAlbum = album;
    albumsContainer.classList.add("hidden");
    albumView.classList.remove("hidden");
    albumTitle.textContent = album.title;
    renderPhotos(album.photos);
}

function renderPhotos(photos) {
    photosDiv.innerHTML = "";
    
    if (photos.length === 0) {
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
        
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Foto del álbum";
        
        div.appendChild(img);
        div.addEventListener("click", () => openModal(src));
        
        photosDiv.appendChild(div);
    });
}

function openModal(src) {
    console.log('Abriendo modal con', src);  // aquí SÍ existe src
    modalImage.src = src;
    imageModal.classList.remove("hidden");
}


modalClose.addEventListener("click", () => {
    imageModal.classList.add("hidden");
});

imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) {
        imageModal.classList.add("hidden");
    }
});


// ================== EVENT LISTENERS ==================
volverBtn.addEventListener("click", () => {
    albumView.classList.add("hidden");
    albumsContainer.classList.remove("hidden");
});

modalClose.addEventListener("click", () => {
    imageModal.classList.add("hidden");
});

imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) {
        imageModal.classList.add("hidden");
    }
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
    
    // Inicializar la galería
    loadAlbums();
});