// =============================
// FILTROS
// =============================
const filterButtons = document.querySelectorAll(".filters button");
const galleryContainer = document.getElementById("gallery-container");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(b => b.classList.toggle("active", b === button));

    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach(item => {
      const categoryMatches = filter === "all" || item.dataset.category === filter;
      item.style.display = categoryMatches ? "block" : "none";
    });
  });
});

// =============================
// MENU ADAPTABLE
// =============================
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// =============================
// LOGIN / PERFIL
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const btnIniciar = document.getElementById("btn-iniciar");
  const btnRegistrar = document.getElementById("btn-registrar");
  const perfilDropdown = document.getElementById("perfil-icono");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const cerrarSesion = document.getElementById("cerrar-sesion");

  const estaLogueado = sessionStorage.getItem("usuarioLogueado") === "true";

  if (estaLogueado) {
    if (btnIniciar) btnIniciar.style.display = "none";
    if (btnRegistrar) btnRegistrar.style.display = "none";
    if (perfilDropdown) perfilDropdown.style.display = "inline-block";
  } else {
    if (btnIniciar) btnIniciar.style.display = "inline-block";
    if (btnRegistrar) btnRegistrar.style.display = "inline-block";
    if (perfilDropdown) perfilDropdown.style.display = "none";
  }

  if (perfilDropdown) {
    perfilDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      dropdownMenu.classList.add("hidden");
    });
  }

  if (cerrarSesion) {
    cerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "museo1.html";
    });
  }

  if (btnRegistrar) {
    btnRegistrar.addEventListener("click", () => {
      sessionStorage.setItem("paginaAnterior", window.location.href);
    });
  }
});

// =============================
// MENSAJE FLOTANTE
// =============================
document.addEventListener('DOMContentLoaded', () => {
  const mensaje = document.getElementById('mini_mensaje');
  mensaje.textContent = 'Para ver más información pasar el cursor por la carpeta ';
  mensaje.classList.add('mostrar');

  setTimeout(() => {
    mensaje.classList.remove('mostrar');
  }, 3000);
});

// =============================
// CREAR TARJETA DE EXPOSICIÓN
// =============================
function crearGalleryItem({ titulo, autor, descripcion, video, imagen }) {
  const item = document.createElement("div");
  item.classList.add("gallery-item");

  item.innerHTML = `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img src="${imagen}" alt="${titulo}" class="imagen-carta" />
        </div>
        <div class="flip-card-back">
          <h3>${titulo}</h3>
          <p><strong>Autor:</strong> ${autor}</p>
          <button class="btn-ver"
            data-titulo="${titulo}"
            data-autor="${autor}"
            data-descripcion="${descripcion}"
            data-video="${video}"
            data-imagen="${imagen}">
            Ver más
          </button>
        </div>
      </div>
    </div>
  `;

  galleryContainer.appendChild(item);
}

// =============================
// CARGAR EXPOSICIONES DESDE EL BACKEND
// =============================
axios.get("http://127.0.0.1:8000/api/v1/exposiciones/")
  .then(res => {
    const exposiciones = res.data.data;
    exposiciones.forEach(expo => {
      crearGalleryItem({
        titulo: expo.titulo || "",
        autor: expo.autor || "",
        descripcion: expo.descripcion || "",
        video: expo.video || "",
        imagen: expo.imagen ? `http://127.0.0.1:8000${expo.imagen}` : "../imagenes/default.png"
      });
    });

    // Inicializar modal después de cargar las exposiciones
    inicializarModal();
  })
  .catch(err => {
    console.error("Error al cargar exposiciones:", err);
  });

// =============================
// MODAL
// =============================
function inicializarModal() {
  const modal = document.getElementById("modal-expo");
  const cerrar = modal.querySelector(".cerrar");

  galleryContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-ver")) {
      document.getElementById("modal-titulo").textContent = e.target.dataset.titulo;
      document.getElementById("modal-autor").textContent = e.target.dataset.autor;
      document.getElementById("modal-descripcion").textContent = e.target.dataset.descripcion;

      const enlace = document.getElementById("modal-enlace");
      if (e.target.dataset.video) {
        enlace.href = e.target.dataset.video;
        enlace.style.display = "inline-block";
      } else {
        enlace.style.display = "none";
      }

      const imgModal = document.getElementById("modal-imagen");
      imgModal.src = e.target.dataset.imagen || "";
      imgModal.style.display = e.target.dataset.imagen ? "block" : "none";

      modal.style.display = "flex";
    }
  });

  cerrar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}