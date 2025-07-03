document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".carta");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Simulación de validación: correos de administrador
    const correosAdmin = ['admin@cultura.com', 'admin@caldas.gov.co'];

    // Guardar estado de sesión
    sessionStorage.setItem("usuarioLogueado", "true");

    // Redirección según tipo de usuario
    if (correosAdmin.includes(email)) {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'inicio.html';
    }
  });
});


//pagina anterior de iniciar sesion
// Recupera la página anterior
    const paginaAnterior = sessionStorage.getItem("paginaAnterior");

    if (correosAdmin.includes(email)) {
      window.location.href = "admin.html"; // si eres admin vas a admin
    } else if (paginaAnterior) {
      window.location.href = paginaAnterior; // si no, vuelve a donde estabas
    } else {
      window.location.href = "inicio.html"; // si no hay página guardada
    }
