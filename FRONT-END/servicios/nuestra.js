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
