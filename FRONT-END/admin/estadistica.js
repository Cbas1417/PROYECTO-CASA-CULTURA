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
// CRUD LOCAL
// ==========================
let exposiciones = JSON.parse(localStorage.getItem("exposiciones")) || [];

// Renderizar tabla
function render(filtro = "") {
  tablaExposiciones.innerHTML = "";

  exposiciones
    .filter(expo => expo.titulo.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((expo, index) => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>
          ${expo.imagen ? `<img src="${expo.imagen}" alt="${expo.titulo}" />` : ""}
        </td>
        <td>${expo.titulo}</td>
        <td>${expo.autor}</td>
        <td>${expo.descripcion}</td>
        <td>
          ${expo.video ? `<a href="${expo.video}" target="_blank">Ver video</a>` : ""}
        </td>
        <td>
          <button class="accion editar" onclick="editarExposicion(${index})">Editar</button>
          <button class="accion eliminar" onclick="eliminarExposicion(${index})">Eliminar</button>
        </td>
      `;

      tablaExposiciones.appendChild(fila);
    });
}

// Guardar en localStorage
function guardarLocal() {
  localStorage.setItem("exposiciones", JSON.stringify(exposiciones));
}

// Crear/Actualizar Exposición
obraForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const descripcion = document.getElementById("descripcion").value;
  const video = document.getElementById("video").value;
  const imagenInput = document.getElementById("imagen");

  let imagen = "";
  if (imagenInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (event) {
      imagen = event.target.result;
      guardarObra(titulo, autor, descripcion, video, imagen);
    };
    reader.readAsDataURL(imagenInput.files[0]);
  } else {
    guardarObra(titulo, autor, descripcion, video, imagen);
  }
});

function guardarObra(titulo, autor, descripcion, video, imagen) {
  if (obraForm.dataset.editIndex !== undefined) {
    // Editar
    const index = obraForm.dataset.editIndex;
    exposiciones[index] = { titulo, autor, descripcion, video, imagen };
    delete obraForm.dataset.editIndex;
  } else {
    // Crear
    exposiciones.push({ titulo, autor, descripcion, video, imagen });
  }

  guardarLocal();
  render();
  obraForm.reset();
}

// Editar
window.editarExposicion = function (index) {
  const expo = exposiciones[index];
  document.getElementById("titulo").value = expo.titulo;
  document.getElementById("autor").value = expo.autor;
  document.getElementById("descripcion").value = expo.descripcion;
  document.getElementById("video").value = expo.video;

  obraForm.dataset.editIndex = index;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Eliminar
window.eliminarExposicion = function (index) {
  if (confirm("¿Seguro que quieres eliminar esta exposición?")) {
    exposiciones.splice(index, 1);
    guardarLocal();
    render();
  }
};

// ==========================
// Buscador
// ==========================
buscador.addEventListener("input", (e) => render(e.target.value));

// ==========================
// Inicializar
// ==========================
render();

// ==========================
// SIMULACIÓN DE SESIÓN ACTIVA
// ==========================
const usuarioAutenticado = true; // ponlo en false si quieres probar sin sesión

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
