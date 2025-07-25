/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});

//logueo
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
      window.location.href = "museo2.html";
    });
  }

  if (btnRegistrar) {
    btnRegistrar.addEventListener("click", () => {
      sessionStorage.setItem("paginaAnterior", window.location.href);
    });
  }
});
