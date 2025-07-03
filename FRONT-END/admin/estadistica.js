// Menú hamburguesa
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// Menú usuario
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

// Chart 1: Usuarios registrados
new Chart(document.getElementById("usuariosChart"), {
  type: "bar",
  data: {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [{
      label: "Usuarios",
      data: [12, 19, 9, 14, 22, 17],
      backgroundColor: "#FF9015"
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  }
});

// Chart 2: Programa popular
new Chart(document.getElementById("programasChart"), {
  type: "pie",
  data: {
    labels: ["Danza", "Pintura", "Teatro", "Música"],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: ["#3D4543", "#FF9015", "#888", "#ddd"]
    }]
  }
});

// Chart 3: Obras más visitadas
new Chart(document.getElementById("obrasChart"), {
  type: "line",
  data: {
    labels: ["Obra A", "Obra B", "Obra C", "Obra D"],
    datasets: [{
      label: "Visitas",
      data: [100, 150, 80, 120],
      borderColor: "#3D4543",
      backgroundColor: "#FF9015",
      tension: 0.3,
      fill: true
    }]
  }
});
