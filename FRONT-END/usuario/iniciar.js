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

    const correosAdmin = ['admin@cultura.com', 'admin@caldas.gov.co'];

    // Guardar sesión
    localStorage.setItem("usuarioActivo", email);

    // Obtener parámetro de redirección
    const params = new URLSearchParams(window.location.search);
    const paginaAnterior = params.get("from");

    // Redirección
    if (correosAdmin.includes(email)) {
      window.location.href = 'admin.html';
    } else if (paginaAnterior) {
      window.location.href = decodeURIComponent(paginaAnterior);
    } else {
      window.location.href = 'inicio.html';
    }
  });
});

// Suponiendo que aquí validas el login exitoso
sessionStorage.setItem("usuarioLogueado", "true");

// Si quieres guardar también una imagen personalizada en el futuro:
// sessionStorage.setItem("imagenPerfil", "ruta/a/la/imagen.jpg");

