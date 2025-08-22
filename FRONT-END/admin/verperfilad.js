// SIMULACIÓN DE SESIÓN ACTIVA
const usuarioAutenticado = true; // cambia a false si quieres ocultar el menú

document.addEventListener("DOMContentLoaded", () => {
  const registroBtn = document.getElementById("btn-iniciar");
  const loginBtn = document.getElementById("btn-registrar");
  const perfilDropdown = document.getElementById("perfil-icono");

  if (usuarioAutenticado) {
    registroBtn.style.display = "none";
    loginBtn.style.display = "none";
    perfilDropdown.style.display = "inline-block";
  } else {
    registroBtn.style.display = "inline-block";
    loginBtn.style.display = "inline-block";
    perfilDropdown.style.display = "none";
  }

  // 🔹 Cargar datos almacenados en localStorage
  const campos = ["documento", "nombre", "correo", "nacimiento", "telefono"];
  campos.forEach(id => {
    const input = document.getElementById(id);
    const valorGuardado = localStorage.getItem(id);
    if (valorGuardado) {
      input.value = valorGuardado;
    }
  });
});

// MENÚ HAMBURGUESA
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// FUNCIONALIDAD EDITAR PERFIL
const editarBtn = document.getElementById("editarBtn");
const guardarBtn = document.getElementById("guardarBtn");
const cancelarBtn = document.getElementById("cancelarBtn");

const campos = ["documento", "nombre", "correo", "nacimiento", "telefono"];
let valoresOriginales = {};

editarBtn.addEventListener("click", () => {
  campos.forEach(id => {
    const input = document.getElementById(id);
    valoresOriginales[id] = input.value;
    input.removeAttribute("readonly");
    input.style.background = "#fff";
    input.style.border = "1px solid #888";
  });

  editarBtn.style.display = "none";
  guardarBtn.style.display = "inline-block";
  cancelarBtn.style.display = "inline-block";
});

guardarBtn.addEventListener("click", () => {
  campos.forEach(id => {
    const input = document.getElementById(id);
    input.setAttribute("readonly", true);
    input.style.background = "#f1f1f1";
    input.style.border = "1px solid #ccc";

    // 🔹 Guardar cambios en localStorage
    localStorage.setItem(id, input.value);
  });

  editarBtn.style.display = "inline-block";
  guardarBtn.style.display = "none";
  cancelarBtn.style.display = "none";
});

cancelarBtn.addEventListener("click", () => {
  campos.forEach(id => {
    const input = document.getElementById(id);
    input.value = valoresOriginales[id];
    input.setAttribute("readonly", true);
    input.style.background = "#f1f1f1";
    input.style.border = "1px solid #ccc";
  });

  editarBtn.style.display = "inline-block";
  guardarBtn.style.display = "none";
  cancelarBtn.style.display = "none";
});

// Mostrar/ocultar el menú de perfil con clic
const perfilImg = document.getElementById("perfil-img");
const dropdownMenu = document.getElementById("dropdown-menu");

perfilImg.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle("hidden");
});

// Ocultar el menú si se hace clic fuera
document.addEventListener("click", (e) => {
  if (!perfilImg.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.add("hidden");
  }
});
