// --- Menú hamburguesa ---
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// --- Menú usuario ---
const userIcon = document.getElementById("user-icon");
const dropdown = document.getElementById("dropdown-menu");

userIcon.addEventListener("click", () => {
  dropdown.classList.toggle("hidden");
});
document.addEventListener("click", function(e) {
  if (!userIcon.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.add("hidden");
  }
});

// --- Elementos del DOM ---
const tablaExposiciones = document.getElementById("exposicionesTableBody");
const buscador = document.getElementById("buscarExposicion");

// ==========================
// Función para cargar exposiciones desde la API
// ==========================
async function cargarExposiciones() {
  try {
    // Cambia la URL según tu proyecto y app
    const res = await axios.get("http://localhost:8000/tu_app/exposiciones/");
    let exposiciones = res.data;

    function render(filtro = "") {
      tablaExposiciones.innerHTML = "";

      exposiciones
        .filter(expo => expo.titulo.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(expo => {
          const fila = document.createElement("tr");

          fila.innerHTML = `
            <td>
              ${expo.imagen ? `<img src="http://localhost:8000${expo.imagen}" alt="${expo.titulo}" />` : ""}
            </td>
            <td>${expo.titulo}</td>
            <td>${expo.autor}</td>
            <td>${expo.descripcion}</td>
            <td>
              ${expo.video ? `<a href="${expo.video}" target="_blank">Ver video</a>` : ""}
            </td>
          `;

          tablaExposiciones.appendChild(fila);
        });
    }

    // Render inicial
    render();

    // Evento del buscador
    buscador.addEventListener("input", (e) => render(e.target.value));

  } catch (error) {
    console.error("Error cargando exposiciones:", error);
    tablaExposiciones.innerHTML = `<tr><td colspan="5">No se pudieron cargar las exposiciones.</td></tr>`;
  }
}

// ==========================
// Inicializar
// ==========================
cargarExposiciones();
