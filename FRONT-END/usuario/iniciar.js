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

    try{
      //envia datos al backend por xios
      const response = await axios.post("http://127.0.0.1:8000/api/v1/seguridad/login", {
        correo: email,
        password: password
      });
      const data=response.data;
      //aqui guardamos token y usuario
      localStorage.setItem("token", data.Token);
      localStorage.setItem("usuarioActivo", email);
      sessionStorage.setItem("usuarioLogueado", "true");
      //redirijir
      const correosAdmin = ['sj153175@gmail.com', 'admin@caldas.gov.co'];
      const params = new URLSearchParams(window.location.search);
      const paginaAnterior = params.get("from");
      if (correosAdmin.includes(email)) {
        window.location.href = '../dashboard.html';
      } else if (paginaAnterior) {
        window.location.href = decodeURIComponent(paginaAnterior);
      } else {
        window.location.href = 'inicio.html';
      }
    } catch (error){
      if (error.response){
        alert(error.response.data.mensaje || "Error en el inicio de sesión");
      } else {
        alert("Error de red o conexión con el servidor");
        console.error(error);
      }
    }
  });
});

// Si el usuario es admin:
localStorage.setItem("rol", "admin");
// También marca como logueado:
sessionStorage.setItem("usuarioLogueado", "true");


    // const correosAdmin = ['admin@cultura.com', 'admin@caldas.gov.co'];

    // // Guardar sesión
    // localStorage.setItem("usuarioActivo", email);

    // // Obtener parámetro de redirección
    // const params = new URLSearchParams(window.location.search);
    // const paginaAnterior = params.get("from");

    // // Redirección
    // if (correosAdmin.includes(email)) {
    //   window.location.href = 'admin.html';
    // } else if (paginaAnterior) {
    //   window.location.href = decodeURIComponent(paginaAnterior);
    // } else {
    //   window.location.href = 'inicio.html';
    // }

// Suponiendo que aquí validas el login exitoso
// sessionStorage.setItem("usuarioLogueado", "true");

// Si quieres guardar también una imagen personalizada en el futuro:
// sessionStorage.setItem("imagenPerfil", "ruta/a/la/imagen.jpg");

