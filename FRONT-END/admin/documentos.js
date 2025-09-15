  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-usuario");
    const tabla = document.getElementById("tabla-usuarios");
    const buscador = document.getElementById("buscador");

    const modal = document.getElementById("modal-eliminar");
    const modalTexto = document.getElementById("modal-texto");
    const btnConfirmar = document.getElementById("btn-confirmar-eliminar");
    const btnCancelar = document.getElementById("btn-cancelar-eliminar");

    let usuarios = [];
    let idEliminar = null;

    const API_URL = "http://127.0.0.1:8000/api/v1"; // Ajusta según tu server

    // ✅ Cargar usuarios existentes
    const cargarUsuarios = async () => {
      try {
        mostrarCarga();
        const res = await axios.get(`${API_URL}/usuarios/`);
        console.log(res.data);
        usuarios = res.data.data;
        renderTabla(usuarios);
      } catch (err) {
        console.error(err);
        mostrarError("Error al cargar usuarios");
      }
    };

    // ✅ Mostrar estado de carga
    function mostrarCarga() {
      tabla.innerHTML = `
        <tr>
          <td colspan="6">
            <div style="text-align: center; padding: 40px; color: #666;">
              <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 15px;"></i>
              <p>Cargando usuarios...</p>
            </div>
          </td>
        </tr>
      `;
    }

    // ✅ Mostrar mensaje de error
    function mostrarError(mensaje) {
      tabla.innerHTML = `
        <tr>
          <td colspan="6">
            <div style="text-align: center; padding: 40px; color: #d32f2f;">
              <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px;"></i>
              <p>${mensaje}</p>
              <button onclick="cargarUsuarios()" style="margin-top: 15px; padding: 8px 16px; background: #3D4543; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Reintentar
              </button>
            </div>
          </td>
        </tr>
      `;
    }

    // ✅ Mostrar estado vacío
    function mostrarEstadoVacio() {
      tabla.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <i class="fas fa-users"></i>
              <h3>No hay usuarios registrados</h3>
              <p>Agrega usuarios usando el formulario a la derecha.</p>
            </div>
          </td>
        </tr>
      `;
    }

    // ✅ Renderizar tabla
    const renderTabla = (data) => {
      if (data.length === 0) {
        mostrarEstadoVacio();
        return;
      }
      
      tabla.innerHTML = `
        <thead>
          <tr>
            <th>ID</th>
            <th>Documento</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(u => `
            <tr>
              <td>${u.id}</td>
              <td>${u.tipo_documento} ${u.numero_documento}</td>
              <td>${u.nombre}</td>
              <td>${u.correo}</td>
              <td>${u.telefono}</td>
              <td>
                <button class="btn-eliminar" data-id="${u.id}">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      `;

      // Bind botones eliminar
      document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", (e) => {
          idEliminar = e.target.closest('.btn-eliminar').dataset.id;
          const usuario = usuarios.find(u => u.id == idEliminar);
          modalTexto.textContent = `¿Estás seguro de que deseas eliminar al usuario "${usuario.nombre}" (${usuario.tipo_documento} ${usuario.numero_documento})?`;
          modal.classList.add("visible");
        });
      });
    };

    // ✅ Agregar usuario
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        tipo_documento: document.getElementById("tipo_d").value,
        numero_documento: document.getElementById("documento").value,
        nombre: document.getElementById("nombre").value,
        fecha_nacimiento: document.getElementById("nacimiento").value,
        correo: document.getElementById("correo").value,
        telefono: document.getElementById("telefono").value,
        password: document.getElementById("contrasena").value
      };

      try {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;
        
        await axios.post(`${API_URL}/usuarios/`, data);
        mostrarMensaje("Usuario registrado correctamente. Revisa tu correo para activación.", "success");
        form.reset();
        cargarUsuarios();
        
        btn.innerHTML = originalText;
        btn.disabled = false;
      } catch (err) {
        console.error(err.response?.data || err);
        mostrarError("Error al registrar usuario: " + (err.response?.data?.message || ""));
        
        const btn = form.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Guardar Usuario';
        btn.disabled = false;
      }
    });

    // ✅ Confirmar eliminación
    btnConfirmar.addEventListener("click", async () => {
      if (idEliminar) {
        try {
          btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
          btnConfirmar.disabled = true;
          
          await axios.delete(`${API_URL}/usuarios/${idEliminar}/`);
          mostrarMensaje("Usuario eliminado correctamente", "success");
          modal.classList.remove("visible");
          cargarUsuarios();
        } catch (err) {
          console.error(err.response?.data || err);
          mostrarError("Error al eliminar usuario: " + (err.response?.data?.message || ""));
        } finally {
          btnConfirmar.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
          btnConfirmar.disabled = false;
        }
      }
    });

    btnCancelar.addEventListener("click", () => {
      modal.classList.remove("visible");
      idEliminar = null;
    });

    // ✅ Buscador
    buscador.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(q) ||
        u.numero_documento.includes(q)
      );
      renderTabla(filtrados);
    });

    // ✅ Mostrar mensajes flotantes
    function mostrarMensaje(mensaje, tipo) {
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
      
      setTimeout(() => {
        mensajeEl.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          document.body.removeChild(mensajeEl);
        }, 300);
      }, 3000);
    }

    // 🚀 Cargar al inicio
    cargarUsuarios();

    // Configuración del menú de usuario
    const usuarioLogueado = true;
    const perfilIcono = document.getElementById("perfil-icono");
    if (usuarioLogueado && perfilIcono) {
      perfilIcono.style.display = "block";
    }

    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");

    if (menuToggle && menu) {
      menuToggle.addEventListener("click", () => {
        menu.classList.toggle("active");
      });
    }

    const dropdownMenu = document.getElementById("dropdown-menu");
    if (perfilIcono && dropdownMenu) {
      perfilIcono.addEventListener("click", () => {
        dropdownMenu.classList.toggle("hidden");
      });

      document.addEventListener("click", (e) => {
        if (!perfilIcono.contains(e.target)) {
          dropdownMenu.classList.add("hidden");
        }
      });
    }
  });