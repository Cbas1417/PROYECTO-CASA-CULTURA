document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.getElementById('user-icon');
  const dropdownMenu = document.getElementById('dropdown-menu');

  userIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', function (e) {
    if (!userIcon.contains(e.target)) {
      dropdownMenu.classList.add('hidden');
    }
  });

  const statsContainer = document.getElementById("stats-container");

  // Petición con Axios al backend
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

// Menú adaptable
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
}
