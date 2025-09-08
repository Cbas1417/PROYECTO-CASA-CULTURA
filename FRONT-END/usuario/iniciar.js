document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".carta");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      // envia datos al backend por axios
      const response = await axios.post("http://127.0.0.1:8000/api/v1/seguridad/login", {
        correo: email,
        password: password
      });

      const data = response.data;

      // ✅ guardar token, id y datos útiles del usuario
      localStorage.setItem("token", data.Token);
      localStorage.setItem("user_id", data.ID);           // <-- añadido
      localStorage.setItem("nombre", data.Nombre || "");  // <-- opcional
      localStorage.setItem("usuarioActivo", email);
      sessionStorage.setItem("usuarioLogueado", "true");

      // Redirigir según rol o página previa
      const correosAdmin = ['sj153175@gmail.com', 'admin@caldas.gov.co'];
      const params = new URLSearchParams(window.location.search);
      const paginaAnterior = params.get("from");

      if (correosAdmin.includes(email)) {
        localStorage.setItem("rol", "admin");
        sessionStorage.setItem("usuarioLogueado", "true");
        window.location.href = '../admin/dashboard.html';
      } else if (paginaAnterior) {
        sessionStorage.setItem("usuarioLogueado", "true");
        window.location.href = decodeURIComponent(paginaAnterior);
      } else {
        sessionStorage.setItem("usuarioLogueado", "true");
        window.location.href = 'inicio.html';
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.mensaje || "Error en el inicio de sesión");
      } else {
        alert("Error de red o conexión con el servidor");
        console.error(error);
      }
    }
  });
});

// ojito pa la contra
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
});
