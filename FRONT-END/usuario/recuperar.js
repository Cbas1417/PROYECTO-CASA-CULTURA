document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.carta");
  const modal = document.getElementById("modal-success");

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); 
    const emailInput = document.getElementById("email");
    const correo = emailInput.value.trim();

    if (correo === "" || !correo.includes("@")) {
      alert("Por favor, ingresa un correo válido.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/v1/seguridad/recuperar", { correo });

      console.log("Respuesta del backend:", res.data);

      modal.style.display = "flex";

      setTimeout(() => {
        window.location.href = "iniciar.html";
      }, 2000);

    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        alert(err.response.data.mensaje || "Error al enviar el correo");
      } else {
        alert("Error de red. Intenta nuevamente.");
      }
    }
  });
});
