document.querySelectorAll('.con').forEach(item => {
item.addEventListener('click', () => {
    item.classList.toggle('active');
});
});


/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});

document.addEventListener("DOMContentLoaded", () => {
  const registroBtn = document.getElementById("registrarse");
  const loginBtn = document.getElementById("iniciar");
  const perfilDropdown = document.getElementById("perfil-icono");
  const cerrarSesionBtn = document.getElementById("cerrar-sesion");

  // Verificar si el usuario está logueado
  const usuarioLogueado = localStorage.getItem("usuarioLogueado") === "true";

  if (usuarioLogueado) {
    registroBtn.style.display = "none";
    loginBtn.style.display = "none";
    perfilDropdown.style.display = "inline-block";
  } else {
    registroBtn.style.display = "inline-block";
    loginBtn.style.display = "inline-block";
    perfilDropdown.style.display = "none";
  }

  // Cerrar sesión
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.setItem("usuarioLogueado", "false");
      location.reload(); // recarga para reflejar el cambio
    });
  }

  // Menú hamburguesa
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  // Menú de perfil desplegable
  const perfilImg = document.getElementById("perfil-img");
  const dropdownMenu = document.getElementById("perfil-menu");

  if (perfilImg && dropdownMenu) {
    perfilImg.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });

    // Ocultar menú si se hace clic fuera
    document.addEventListener("click", (e) => {
      if (!perfilImg.contains(e.target)) {
        dropdownMenu.style.display = "none";
      }
    });
  }
});


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

      dropdownMenu.addEventListener("click", (e) => {
        e.stopPropagation(); // evita que se cierre al hacer clic dentro del menú
      });

      document.addEventListener("click", () => {
        dropdownMenu.classList.add("hidden");
      });
    }

    if (cerrarSesion) {
      cerrarSesion.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("usuarioLogueado");
        window.location.href = "index.html"; // recarga la misma página
      });
    }

    if (btnRegistrar) {
      btnRegistrar.addEventListener("click", () => {
        sessionStorage.setItem("paginaAnterior", window.location.href);
      });
    }
  });



//
const timelineItems = document.querySelectorAll('.timeline-item');
const dateIndicator = document.getElementById('date-indicator');

timelineItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    // Cambiar fecha en el indicador
    dateIndicator.textContent = item.dataset.year;

    // Quitar clase active de todos
    timelineItems.forEach(i => i.classList.remove('active'));

    // Activar el actual
    item.classList.add('active');

    // Centrar el elemento activo
    item.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  });
});

// Mostrar el primero por defecto
timelineItems[0].classList.add('active');
dateIndicator.textContent = timelineItems[0].dataset.year;
