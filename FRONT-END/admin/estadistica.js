// --- Menú hamburguesa ---
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// --- Elementos del DOM ---
const tablaExposiciones = document.getElementById("exposicionesTableBody");
const buscador = document.getElementById("buscarExposicion");
const obraForm = document.getElementById("obraForm");

// ==========================
// CONFIG API
// ==========================
const API_URL = "http://localhost:8000/api/v1/exposiciones/"; // 👈 cambia si usas otro host o puerto

let exposiciones = [];

// ==========================
// Renderizar tabla
// ==========================
function render(filtro = "") {
  tablaExposiciones.innerHTML = "";

  exposiciones
    .filter(expo => expo.titulo.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((expo) => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>
          ${expo.imagen ? `<img src="${expo.imagen}" alt="${expo.titulo}" width="100"/>` : ""}
        </td>
        <td>${expo.titulo}</td>
        <td>${expo.autor}</td>
        <td>${expo.descripcion}</td>
        <td>
          ${expo.video ? `<a href="${expo.video}" target="_blank">Ver video</a>` : ""}
        </td>
        <td>
          <button class="accion editar" onclick="editarExposicion(${expo.id})">Editar</button>
          <button class="accion eliminar" onclick="eliminarExposicion(${expo.id})">Eliminar</button>
        </td>
      `;

      tablaExposiciones.appendChild(fila);
    });
}

// ==========================
// Cargar exposiciones desde API
// ==========================
async function cargarExposiciones() {
  try {
    const res = await axios.get(API_URL);
    exposiciones = res.data.data; // tu API devuelve {"data": [...]}
    render();
  } catch (err) {
    console.error("Error al cargar exposiciones:", err);
  }
}

// ==========================
// Crear/Actualizar Exposición
// ==========================
obraForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const descripcion = document.getElementById("descripcion").value;
  const video = document.getElementById("video").value;
  const imagenInput = document.getElementById("imagen");

  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("autor", autor);
  formData.append("descripcion", descripcion);
  if (video) formData.append("video", video);
  if (imagenInput.files.length > 0) {
    formData.append("imagen", imagenInput.files[0]);
  }

  try {
    if (obraForm.dataset.editId) {
      // Editar
      const id = obraForm.dataset.editId;
      await axios.put(`${API_URL}${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      delete obraForm.dataset.editId;
    } else {
      // Crear
      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    obraForm.reset();
    cargarExposiciones();
  } catch (err) {
    console.error("Error al guardar exposición:", err.response?.data || err);
    alert("Error al guardar exposición");
  }
});

// ==========================
// Editar
// ==========================
window.editarExposicion = function (id) {
  const expo = exposiciones.find((e) => e.id === id);
  if (!expo) return;

  document.getElementById("titulo").value = expo.titulo;
  document.getElementById("autor").value = expo.autor;
  document.getElementById("descripcion").value = expo.descripcion;
  document.getElementById("video").value = expo.video || "";

  obraForm.dataset.editId = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ==========================
// Eliminar
// ==========================
window.eliminarExposicion = async function (id) {
  if (confirm("¿Seguro que quieres eliminar esta exposición?")) {
    try {
      await axios.delete(`${API_URL}${id}/`);
      cargarExposiciones();
    } catch (err) {
      console.error("Error al eliminar exposición:", err.response?.data || err);
      alert("Error al eliminar exposición");
    }
  }
};

// ==========================
// Buscador
// ==========================
buscador.addEventListener("input", (e) => render(e.target.value));

// ==========================
// Inicializar
// ==========================
cargarExposiciones();

// ==========================
// SIMULACIÓN DE SESIÓN ACTIVA
// ==========================
const usuarioAutenticado = true;

document.addEventListener("DOMContentLoaded", () => {
  const perfilDropdown = document.getElementById("perfil-icono");

  if (usuarioAutenticado) {
    perfilDropdown.style.display = "inline-block";
  } else {
    perfilDropdown.style.display = "none";
  }

  const perfilImg = document.getElementById("perfil-img");
  const dropdownMenu = document.getElementById("dropdown-menu");

  if (perfilImg) {
    perfilImg.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!perfilImg.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });
  }
});