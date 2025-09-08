//conexion

// =============================
// SESIÓN ACTIVA (validación)
// =============================
const userId = localStorage.getItem("user_id");
const token = localStorage.getItem("token");

if (!userId || !token) {
  alert("Debes iniciar sesión primero");
  window.location.href = "../usuario/iniciar.html";
}

// =============================
// CARGAR DATOS DEL PERFIL
// =============================
axios.get(`http://127.0.0.1:8000/api/v1/usuarios/${userId}/`, {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => {
  const usuario = res.data;

  document.getElementById("documento").value = usuario.numero_documento;
  document.getElementById("nombre").value = usuario.nombre;
  document.getElementById("correo").value = usuario.correo;
  document.getElementById("nacimiento").value = usuario.fecha_nacimiento;
  document.getElementById("telefono").value = usuario.telefono;
})
.catch(err => {
  console.error("❌ Error cargando perfil:", err);
  alert("No se pudo cargar el perfil.");
});

// =============================
// EDITAR / GUARDAR / CANCELAR
// =============================
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
  // 1. Tomar valores actuales
  const data = {
    tipo_documento: "CC",  // 👈 cámbialo si quieres usar otro input
    numero_documento: document.getElementById("documento").value,
    nombre: document.getElementById("nombre").value,
    fecha_nacimiento: document.getElementById("nacimiento").value,
    correo: document.getElementById("correo").value,
    telefono: document.getElementById("telefono").value,
    password: "" // opcional
  };

  // 2. Hacer PUT al backend
  axios.put(`http://127.0.0.1:8000/api/v1/usuarios/${userId}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    alert("✅ Perfil actualizado correctamente");

    // Bloquear inputs otra vez
    campos.forEach(id => {
      const input = document.getElementById(id);
      input.setAttribute("readonly", true);
      input.style.background = "#f1f1f1";
      input.style.border = "1px solid #ccc";
    });
    editarBtn.style.display = "inline-block";
    guardarBtn.style.display = "none";
    cancelarBtn.style.display = "none";
  })
  .catch(err => {
    console.error("❌ Error al actualizar:", err);
    alert("No se pudo actualizar el perfil. Revisa los datos.");
  });
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

// =============================
// MENÚ PERFIL Y HAMBURGUESA
// =============================
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

const perfilImg = document.getElementById("perfil-img");
const dropdownMenu = document.getElementById("dropdown-menu");
perfilImg.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle("hidden");
});
document.addEventListener("click", (e) => {
  if (!perfilImg.contains(e.target)) {
    dropdownMenu.classList.add("hidden");
  }
});
