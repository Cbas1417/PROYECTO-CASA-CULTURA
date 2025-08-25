const filterButtons = document.querySelectorAll(".filters button");
const galleryItems  = document.querySelectorAll(".gallery-item");

filterButtons.forEach(button => {
button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(b => b.classList.toggle("active", b === button));

    galleryItems.forEach(item => {
    const categoryMatches = filter === "all" || item.dataset.category === filter;
    item.style.display = categoryMatches ? "block" : "none";
    });
});
});

/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});

//cerrar
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


//conectar yo creo
axios.get("http://localhost:8000/api/exposiciones/")
  .then(res => {
    const exposiciones = res.data;
    console.log("✅ Exposiciones cargadas:", exposiciones);

    const contenedor = document.getElementById("contenedor-exposiciones");

    exposiciones.forEach(expo => {
      const div = document.createElement("div");
      div.classList.add("exposicion");

      div.innerHTML = `
        <h3>${expo.nombre}</h3>
        <p>${expo.descripcion}</p>
        <p><strong>Duración:</strong> ${expo.tiempo}</p>
      `;

      contenedor.appendChild(div);
    });
  })
  .catch(err => {
    console.error("❌ Error al conectar con exposiciones:", err.message);
  });


//
const galleryContainer = document.getElementById("gallery-container");

// Crear tarjeta y botón para abrir modal
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
          <h3> Acerca de </h3>
          <p><strong></strong></p>
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

document.addEventListener("DOMContentLoaded", () => {
  const exposiciones = JSON.parse(localStorage.getItem("exposiciones")) || [];

  exposiciones.forEach(expo => {
    crearGalleryItem(expo);
  });

  // === Modal ===
  const modal = document.getElementById("modal-expo");
  const cerrar = modal.querySelector(".cerrar");

  // Abrir modal al hacer clic en cualquier "Ver más"
  galleryContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-ver")) {
      document.getElementById("modal-titulo").textContent = e.target.dataset.titulo;
      document.getElementById("modal-autor").textContent = e.target.dataset.autor;
      document.getElementById("modal-descripcion").textContent = e.target.dataset.descripcion;

      // Si hay video, poner el enlace
      const enlace = document.getElementById("modal-enlace");
      if (e.target.dataset.video) {
        enlace.href = e.target.dataset.video;
        enlace.style.display = "inline-block";
      } else {
        enlace.style.display = "none";
      }

      // Imagen en modal
      const imgModal = document.getElementById("modal-imagen");
      imgModal.src = e.target.dataset.imagen || "";
      imgModal.style.display = e.target.dataset.imagen ? "block" : "none";

      modal.style.display = "flex";
    }
  });

  // Cerrar modal
  cerrar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});