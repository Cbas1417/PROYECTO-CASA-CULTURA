document.addEventListener("DOMContentLoaded", () => {
const form = document.querySelector("form.carta");
const modal = document.getElementById("modal-success");

form.addEventListener("submit", function (e) {
    e.preventDefault(); 
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    if (email === "" || !email.includes("@")) {
    alert("Por favor, ingresa un correo válido.");
    return;
    }

    modal.style.display = "flex";

    setTimeout(() => {
    window.location.href = "iniciar.html";
    }, 2000);
});
});

