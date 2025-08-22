// --- Parte admin para restringir acceso solo a administradores ---
document.addEventListener("DOMContentLoaded", () => {
  const usuario = localStorage.getItem("usuarioActivo");
  const correosAdmin = ['sj153175@gmail.com', 'admin@caldas.gov.co'];

  if (!usuario || !correosAdmin.includes(usuario)) {
    window.location.href = '../usuario/inicio.html';
  }
});

// --- Cargar estadísticas ---
document.addEventListener("DOMContentLoaded", () => {
  const statsContainer = document.getElementById("stats-container");

  axios.get("http://localhost:8000/api/dashboard/")
    .then(response => {
      const visitas = response.data.data;
      if (visitas.length === 0) {
        statsContainer.innerHTML = "<p>No hay datos registrados.</p>";
        return;
      }

      visitas.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-3";

        const card = document.createElement("div");
        card.className = "card shadow-sm p-3";
        card.innerHTML = `
          <h5 class="card-title">${item.mes} / ${item.anio}</h5>
          <p class="card-text">Visitas: <strong>${item.visitas}</strong></p>
        `;

        col.appendChild(card);
        statsContainer.appendChild(col);
      });
    })
    .catch(error => {
      console.error("Error al obtener los datos del backend:", error);
      statsContainer.innerHTML = "<p class='text-danger'>Error al cargar estadísticas.</p>";
    });
});

// --- Menú adaptable ---
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
}

// --- Menú usuario con sesión ---
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
