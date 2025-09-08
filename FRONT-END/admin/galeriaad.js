/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}
const perfilIcono = document.getElementById("perfil-icono");
const perfilImg = document.getElementById("perfil-img");
const dropdownMenu = document.getElementById("dropdown-menu");

// Mostrar / ocultar menú al hacer clic en la imagen
perfilImg.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");
});

// Cerrar si se hace clic fuera del menú
document.addEventListener("DOMContentLoaded", () => {
  const perfilIcono = document.getElementById("perfil-icono");
  const perfilImg = document.getElementById("perfil-img");
  const dropdownMenu = document.getElementById("dropdown-menu");

  if (perfilImg && dropdownMenu) {
    // Mostrar / ocultar menú
    perfilImg.addEventListener("click", (e) => {
      e.stopPropagation(); // evita que se cierre de inmediato
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



