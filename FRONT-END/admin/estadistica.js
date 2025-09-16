const tabla = document.getElementById('exposicionesTableBody');
const buscador = document.getElementById('buscarExposicion');
const obraForm = document.getElementById('obraForm');
const API_URL = "http://127.0.0.1:8000/api/v1/exposiciones/";

let exposiciones = [];
let currentPage = 1;
const itemsPerPage = 10;

// ======================
// Cargar exposiciones desde backend
// ======================
async function cargarExposiciones() {
  try {
    const res = await axios.get(API_URL);
    exposiciones = res.data.data; // data.data según tu view
    render();
  } catch (error) {
    console.error("Error cargando exposiciones:", error);
    tabla.innerHTML = `<tr><td colspan="6" style="text-align:center;">Error cargando exposiciones</td></tr>`;
  }
}

// ======================
// Render de tabla con paginación
// ======================
function render(filtro = "") {
  let filtered = exposiciones.filter(e =>
    e.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  if (!filtered.length) {
    tabla.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;">No hay exposiciones</td></tr>`;
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = filtered.slice(start, end);

  tabla.innerHTML = "";
  paginated.forEach(expo => {
    const desc = expo.descripcion.length > 100
      ? expo.descripcion.slice(0, 100) + "..."
      : expo.descripcion;

    const tr = document.createElement("tr");
    tr.innerHTML = `
  <td>${expo.imagen
        ? `<img class="img-tabla" src="http://127.0.0.1:8000${expo.imagen}" alt="${expo.titulo}">`
        : "Sin imagen"}</td>
  <td>${expo.titulo}</td>
  <td>${expo.autor}</td>
  <td>${desc}</td>
  <td>${expo.video ? `<a href="${expo.video}" target="_blank">Ver video</a>` : "No disponible"}</td>
  <td>
    <button class="accion editar" onclick="editarExposicion(${expo.id})">Editar</button>
    <button class="accion eliminar" onclick="eliminarExposicion(${expo.id})">Eliminar</button>
  </td>`;

    tabla.appendChild(tr);
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";
    btn.addEventListener("click", () => {
      currentPage = i;
      render(buscador.value);
    });
    container.appendChild(btn);
  }
}

// ======================
// Crear o actualizar exposición
// ======================
obraForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const descripcion = document.getElementById("descripcion").value;
  const video = document.getElementById("video").value;
  const imagenFile = document.getElementById("imagen").files[0];

  formData.append("titulo", titulo);
  formData.append("autor", autor);
  formData.append("descripcion", descripcion);
  formData.append("video", video || "");
  if (imagenFile) formData.append("imagen", imagenFile);

  try {
    if (obraForm.dataset.editId) {
      // EDITAR
      const id = obraForm.dataset.editId;
      await axios.put(`${API_URL}${id}/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      delete obraForm.dataset.editId;
    } else {
      // CREAR
      await axios.post(API_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });
    }

    obraForm.reset();
    cargarExposiciones();
  } catch (error) {
    console.error("Error guardando obra:", error);
    alert("Ocurrió un error al guardar la obra.");
  }
});

// ======================
// Editar exposición
// ======================
window.editarExposicion = (id) => {
  const expo = exposiciones.find(e => e.id === id);
  if (!expo) return;
  document.getElementById("titulo").value = expo.titulo;
  document.getElementById("autor").value = expo.autor;
  document.getElementById("descripcion").value = expo.descripcion;
  document.getElementById("video").value = expo.video || "";
  obraForm.dataset.editId = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ======================
// Eliminar exposición
// ======================
window.eliminarExposicion = async (id) => {
  if (!confirm("¿Eliminar exposición?")) return;
  try {
    await axios.delete(`${API_URL}${id}/`);
    cargarExposiciones();
  } catch (error) {
    console.error("Error eliminando obra:", error);
    alert("No se pudo eliminar la obra.");
  }
};

// ======================
// Buscador
// ======================
buscador.addEventListener("input", (e) => {
  currentPage = 1;
  render(e.target.value);
});

// ======================
// Inicialización
// ======================
document.addEventListener("DOMContentLoaded", () => {
  cargarExposiciones();
});


// ======================
// Mostrar icono de perfil si hay sesión
// ======================
document.addEventListener("DOMContentLoaded", () => {
  cargarExposiciones();

  const perfilIcono = document.getElementById("perfil-icono");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const cerrarSesion = document.getElementById("cerrar-sesion");

  // Ejemplo: si guardas el token en localStorage
  const token = localStorage.getItem("token");

  if (token) {
    perfilIcono.style.display = "inline-block";
  }

  // Abrir/cerrar el menú
  perfilIcono.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  // Cerrar sesión
  cerrarSesion.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "../usuario/iniciar.html";
  });
});
