    const tabla = document.querySelector('#table tbody');
    let filaSeleccionada = null;
    let productos = [];

    // Cargar inventario desde Django
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
        mostrarMensaje("Error al cargar el inventario", "error");
        console.error(error);
      }
    }

    // Inicializar
    document.addEventListener('DOMContentLoaded', function() {
      cargarInventario();
      
      // Configurar eventos
      document.getElementById('btnagregar').addEventListener('click', () => {
        document.getElementById('modalagregar').style.display = 'flex';
      });

      document.getElementById('formagregar').addEventListener('submit', agregarProducto);
      document.getElementById('btneditar').addEventListener('click', abrirModalEditar);
      document.getElementById('formeditar').addEventListener('submit', editarProducto);
      document.getElementById('btneliminar').addEventListener('click', eliminarProducto);
      
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
          const id = row.cells[1]?.textContent.toLowerCase();
          const nombre = row.cells[2]?.textContent.toLowerCase();
          const coincide = id.includes(texto) || nombre.includes(texto);
          row.style.display = coincide ? '' : 'none';
        });
      });

      // Configurar menú de usuario
      const usuarioAutenticado = true;
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

      // Menú adaptable
      const menuToggle = document.getElementById('menu-toggle');
      const menu = document.getElementById('menu');
      if (menuToggle) {
        menuToggle.addEventListener('click', () => {
          menu.classList.toggle('active');
        });
      }
    });

    // Agregar producto
    async function agregarProducto(e) {
      e.preventDefault();

      if (productos.length >= 15) {
        mostrarMensaje("Inventario lleno: solo se permiten 15 productos.", "error");
        return;
      }

      const producto = document.getElementById('productoagregar').value.trim();
      const cantidad = document.getElementById('cantidadagregar').value.trim();
      const detalles = document.getElementById('detallesagregar').value.trim();
      const imgFile = document.getElementById('imgagregar').files[0];

      if (!producto || !cantidad || !detalles || !imgFile) {
        mostrarMensaje("Todos los campos son obligatorios.", "error");
        return;
      }

      const formData = new FormData();
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

        mostrarMensaje(response.data.Mensaje, "success");
        cerrarModal("modalagregar");
        document.getElementById('formagregar').reset();
        await cargarInventario();
      } catch (error) {
        console.log(error);
        mostrarMensaje(error.response?.data?.Mensaje || "Error al agregar producto", "error");
      }
    }

    // Abrir modal de edición
    function abrirModalEditar() {
      if (!filaSeleccionada) {
        mostrarMensaje("Selecciona un producto para editar.", "error");
        return;
      }

      const index = filaSeleccionada.rowIndex - 1;
      const producto = productos[index];

      document.getElementById('productoeditar').value = producto.producto;
      document.getElementById('cantidadeditar').value = producto.cantidad;
      document.getElementById('detalleseditar').value = producto.detalles;

      document.getElementById('modaleditar').style.display = 'flex';
    }

    // Editar producto
    async function editarProducto(e) {
      e.preventDefault();

      const index = filaSeleccionada.rowIndex - 1;
      const id = productos[index].id;
      const producto = document.getElementById('productoeditar').value.trim();
      const cantidad = document.getElementById('cantidadeditar').value.trim();
      const detalles = document.getElementById('detalleseditar').value.trim();
      const imgFile = document.getElementById('imgeditar').files[0];

      if (!producto || !cantidad || !detalles) {
        mostrarMensaje("Todos los campos excepto la imagen son obligatorios.", "error");
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

        mostrarMensaje(response.data.Mensaje, "success");
        cerrarModal("modaleditar");
        document.getElementById('formeditar').reset();
        await cargarInventario();
      } catch (error) {
        mostrarMensaje(error.response?.data?.Mensaje || "Error al editar producto", "error");
      }
    }

    // Eliminar producto
    async function eliminarProducto() {
      if (!filaSeleccionada) {
        mostrarMensaje("Selecciona un producto para eliminar.", "error");
        return;
      }
      
      if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        return;
      }
      
      const index = filaSeleccionada.rowIndex - 1;
      const id = productos[index].id;
      
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/v1/inventario/put_delete/${id}`);
        mostrarMensaje(response.data.mensaje, "success");
        await cargarInventario();
        filaSeleccionada = null;
      } catch (error) {
        mostrarMensaje("Error al eliminar el producto", "error");
      }
    }

    // Cerrar modal
    function cerrarModal(id) {
      document.getElementById(id).style.display = 'none';
    }

    // Renderizar tabla
    function renderizarTabla() {
      tabla.innerHTML = '';
      
      if (productos.length === 0) {
        tabla.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No hay productos en el inventario</h3>
                <p>Agrega productos para comenzar a gestionar tu inventario.</p>
              </div>
            </td>
          </tr>`;
        return;
      }
      
      productos.forEach(p => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td><img src="${p.imagen}" width="50" height="50"></td>
          <td>${p.id}</td>
          <td class="producto-cell">${p.producto}</td>
          <td class="cantidad-cell">${p.cantidad}</td>
          <td class="detalles-cell">${p.detalles}</td>
        `;
        tabla.appendChild(fila);
      });
    }

    // Mostrar mensajes
    function mostrarMensaje(mensaje, tipo) {
      // Crear elemento de mensaje
      const mensajeEl = document.createElement('div');
      mensajeEl.textContent = mensaje;
      mensajeEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
      `;
      
      if (tipo === 'success') {
        mensajeEl.style.backgroundColor = '#28a745';
      } else {
        mensajeEl.style.backgroundColor = '#dc3545';
      }
      
      document.body.appendChild(mensajeEl);
      
      // Eliminar mensaje después de 3 segundos
      setTimeout(() => {
        mensajeEl.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          document.body.removeChild(mensajeEl);
        }, 300);
      }, 3000);
    }

    