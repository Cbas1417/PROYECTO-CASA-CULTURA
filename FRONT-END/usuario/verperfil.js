// =============================
// SESIÓN ACTIVA (validación)
// =============================
const userId = localStorage.getItem("user_id"); // este viene del login (User.id)
const token = localStorage.getItem("token");

if (!userId || !token) {
  alert("Debes iniciar sesión primero");
  window.location.href = "../usuario/iniciar.html";
}

// =============================
// OBTENER usuario_id real (FK → PK Usuario)
// =============================
let usuarioId = null;

axios.get(`http://127.0.0.1:8000/api/v1/usuarios/by-user/${userId}/`, {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => {
  const usuario = res.data;
  usuarioId = usuario.id; // guardamos el id real de Usuario
  localStorage.setItem("usuario_id", usuarioId);

  // =============================
  // CARGAR DATOS DEL PERFIL
  // =============================
  document.getElementById("documento").value = usuario.numero_documento;
  document.getElementById("nombre").value = usuario.nombre;
  document.getElementById("correo").value = usuario.correo;
  document.getElementById("nacimiento").value = usuario.fecha_nacimiento;
  document.getElementById("telefono").value = usuario.telefono;
})
.catch(err => {
  console.error("❌ Error obteniendo usuario:", err);
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
  const data = {
    tipo_documento: "CC",  
    numero_documento: document.getElementById("documento").value,
    nombre: document.getElementById("nombre").value,
    fecha_nacimiento: document.getElementById("nacimiento").value,
    correo: document.getElementById("correo").value,
    telefono: document.getElementById("telefono").value,
    password: "" 
  };

  axios.put(`http://127.0.0.1:8000/api/v1/usuarios/${localStorage.getItem("usuario_id")}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    alert("✅ Perfil actualizado correctamente");
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

// =============================
// MOSTRAR/OCULTAR BOTONES SEGÚN SESIÓN
// =============================
const btnIniciar = document.getElementById("btn-iniciar");
const btnRegistrar = document.getElementById("btn-registrar");
const perfilIcono = document.getElementById("perfil-icono");

if (userId && token) {
  // Usuario autenticado → ocultar registrar/iniciar, mostrar perfil
  if (btnIniciar) btnIniciar.style.display = "none";
  if (btnRegistrar) btnRegistrar.style.display = "none";
  if (perfilIcono) perfilIcono.style.display = "block";
} else {
  // Usuario no autenticado → mostrar registrar/iniciar, ocultar perfil
  if (btnIniciar) btnIniciar.style.display = "inline-block";
  if (btnRegistrar) btnRegistrar.style.display = "inline-block";
  if (perfilIcono) perfilIcono.style.display = "none";
}
