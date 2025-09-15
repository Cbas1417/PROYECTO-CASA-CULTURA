  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  toggle.addEventListener('click', () => menu.classList.toggle('active'));

  const tabla = document.getElementById('exposicionesTableBody');
  const buscador = document.getElementById('buscarExposicion');
  const obraForm = document.getElementById('obraForm');
  const API_URL = "http://localhost:8000/api/v1/exposiciones/";

  let exposiciones = [];           // <--- ahora empieza vacío
  let currentPage = 1;
  const itemsPerPage = 10;

  // Render con paginación
  function render(filtro = "") {
    let filtered = exposiciones.filter(e =>
      e.titulo.toLowerCase().includes(filtro.toLowerCase())
    );

    if (!filtered.length) {
      tabla.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <i class="fas fa-images"></i>
              <h3>No hay exposiciones</h3>
            </div>
          </td>
        </tr>`;
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
      let desc = expo.descripcion.length > 100
        ? expo.descripcion.slice(0, 100) + "..."
        : expo.descripcion;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${expo.imagen ? `<img src="${expo.imagen}" alt="${expo.titulo}">` : "Sin imagen"}</td>
        <td>${expo.titulo}</td>
        <td>${expo.autor}</td>
        <td>${desc}</td>
        <td>${expo.video ? `<a href="${expo.video}" target="_blank">Ver video</a>` : "No disponible"}</td>
        <td>
          <button class="accion editar" onclick="editarExposicion(${expo.id})">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="accion eliminar" onclick="eliminarExposicion(${expo.id})">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </td>`;
      tabla.appendChild(tr);
    });

    renderPagination(totalPages);
  }

  // ----- Paginador -----
  function renderPagination(totalPages) {
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.style.margin = "0 5px";
      btn.className = i === currentPage ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        render(buscador.value);
      });
      container.appendChild(btn);
    }
  }

  async function cargarExposiciones() {
    exposiciones = []; // inicia sin obras
    render();
  }

obraForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = document.getElementById("imagen").files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const nueva = {
      id: obraForm.dataset.editId || Date.now(),
      titulo: document.getElementById("titulo").value,
      autor: document.getElementById("autor").value,
      descripcion: document.getElementById("descripcion").value,
      video: document.getElementById("video").value || "",
      imagen: reader.result || ""   // <-- aquí queda el base64
    };

    if (obraForm.dataset.editId) {
      const idx = exposiciones.findIndex(e => e.id == obraForm.dataset.editId);
      exposiciones[idx] = nueva;
      delete obraForm.dataset.editId;
    } else {
      exposiciones.push(nueva);
    }

    obraForm.reset();
    render(buscador.value);
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    // Si no selecciona imagen, igual guarda sin ella
    reader.onload();
  }
});

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

  window.eliminarExposicion = (id) => {
    if (confirm("¿Eliminar exposición?")) {
      exposiciones = exposiciones.filter(e => e.id !== id);
      render(buscador.value);
    }
  };

  buscador.addEventListener("input", (e) => {
    currentPage = 1;
    render(e.target.value);
  });

  document.addEventListener("DOMContentLoaded", () => {
    cargarExposiciones();

    // Perfil
    const perfil = document.getElementById('perfil-img');
    const menuPerfil = document.getElementById('dropdown-menu');
    perfil.addEventListener('click', e => {
      e.stopPropagation();
      menuPerfil.classList.toggle('hidden');
    });
    document.addEventListener('click', e => {
      if (!perfil.contains(e.target)) menuPerfil.classList.add('hidden');
    });

    document.getElementById('cerrar-sesion').addEventListener('click', e => {
      e.preventDefault();
      alert("Sesión cerrada");
      window.location.href = "../usuario/inicio.html";
    });
  });

document.getElementById("perfil-icono").style.display = "inline-block";
