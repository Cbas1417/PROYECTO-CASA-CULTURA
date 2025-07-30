const tabla = document.querySelector('#table tbody');
let filaSeleccionada = null;
let productos = [];

cargarInventario()

// cargar inventario desde django
async function cargarInventario() {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/v1/inventario/get_post");
    productos = response.data.data.map((item, index) => ({
      id: item.id,
      producto: item.nombre,
      cantidad: item.cantidad,
      detalles: item.descripcion,
      imagen: item.imagen // esta debe ser URL válida del backend
    }));
    renderizarTabla();
  } catch (error) {
    alert("Error al cargar inventario");
    console.error(error);
  }
}



// Agregar fila
document.getElementById('btnagregar').addEventListener('click', () => {
  document.getElementById('modalagregar').style.display = 'flex';
});

document.getElementById('formagregar').addEventListener('submit', async function(e) {
  e.preventDefault();

  if (productos.length >= 15) {
    alert("Inventario lleno: solo se permiten 15 productos.");
    return;
  }

  const producto = document.getElementById('productoagregar').value.trim();
  const cantidad = document.getElementById('cantidadagregar').value.trim();
  const detalles = document.getElementById('detallesagregar').value.trim();
  const imgFile = document.getElementById('imgagregar').files[0];

  if (!producto || !cantidad || !detalles || !imgFile) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const formData= new FormData();
  formData.append("nombre", producto);
  formData.append("cantidad", cantidad);
  formData.append("descripcion", detalles);
  formData.append("imagen", imgFile);

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/v1/inventario/get_post", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    alert(response.data.Mensaje);
    cerrarModal("modalagregar");
    this.reset();
    await cargarInventario();
  } catch (error) {
    console.log(error);
    alert(error.response?.data?.Mensaje || "Error al agregar producto");
  }
});

document.getElementById('btneditar').addEventListener('click', () => {
  if (!filaSeleccionada) {
    alert("Selecciona una fila para editar.");
    return;
  }

  const index = filaSeleccionada.rowIndex - 1;
  const producto = productos[index];

  document.getElementById('ideditar').value = producto.id;
  document.getElementById('productoeditar').value = producto.producto;
  document.getElementById('cantidadeditar').value = producto.cantidad;
  document.getElementById('detalleseditar').value = producto.detalles;

  document.getElementById('modaleditar').style.display = 'flex';
});

document.getElementById('formeditar').addEventListener('submit', async function(e) {
  e.preventDefault();

  const index = filaSeleccionada.rowIndex - 1;
  const id = document.getElementById('ideditar').value.trim();
  const producto = document.getElementById('productoeditar').value.trim();
  const cantidad = document.getElementById('cantidadeditar').value.trim();
  const detalles = document.getElementById('detalleseditar').value.trim();
  const imgFile = document.getElementById('imgeditar').files[0];

  if (!id || !producto || !cantidad || !detalles) {
    alert("Todos los campos excepto la imagen son obligatorios.");
    return;
  }

  const formData = new FormData();
  formData.append("nombre", producto);
  formData.append("cantidad", cantidad);
  formData.append("descripcion", detalles);
  if (imgFile) formData.append("imagen", imgFile);

  try {
    const response = await axios.put(`http://127.0.0.1:8000/api/v1/inventario/put_delete/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    alert(response.data.Mensaje);
    cerrarModal("modaleditar");
    this.reset();
    await cargarInventario();
  } catch (error) {
    alert(error.response?.data?.Mensaje || "Error al editar producto");
  }
});

document.getElementById('btneliminar').addEventListener('click', async () => {
  if (!filaSeleccionada) {
    alert("Selecciona una fila para eliminar.");
    return;
  }
  const index = filaSeleccionada.rowIndex - 1;
  const id = productos[index].id;
  try {
    const response = await axios.delete(`http://127.0.0.1:8000/api/v1/inventario/put_delete/${id}`);
    alert(response.data.mensaje);
    await cargarInventario();
    filaSeleccionada = null;
  } catch (error) {
    alert("Error al eliminar");
  }
  filaSeleccionada = null;
});

tabla.addEventListener('click', function(e) {
  if (e.target.closest('tr')) {
    [...tabla.rows].forEach(row => row.classList.remove('selected'));
    filaSeleccionada = e.target.closest('tr');
    filaSeleccionada.classList.add('selected');
  }
});

document.getElementById('buscador').addEventListener('input', function() {
  const texto = this.value.toLowerCase();
  [...tabla.rows].forEach(row => {
    const coincide = [...row.cells].some(cell =>
      cell.textContent.toLowerCase().includes(texto)
    );
    row.style.display = coincide ? '' : 'none';
  });
});

function cerrarModal(id) {
  document.getElementById(id).style.display = 'none';
}

function guardarEnLocalStorage() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function renderizarTabla() {
  tabla.innerHTML = '';
  productos.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><img src="${p.imagen}" width="50"></td>
      <td>${p.id}</td>
      <td>${p.producto}</td>
      <td>${p.cantidad}</td>
      <td>${p.detalles}</td>
    `;
    tabla.appendChild(fila);
  });
}



document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.getElementById('user-icon');
  const dropdownMenu = document.getElementById('dropdown-menu');

  userIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', function(e) {
    if (!userIcon.contains(e.target)) {
      dropdownMenu.classList.add('hidden');
    }
  });
});

/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}

