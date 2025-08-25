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
            const res = await axios.get(`${API_URL}/usuarios/`);;
            console.log(res.data);
            usuarios = res.data.data;
            renderTabla(usuarios);
        } catch (err) {
            console.error(err);
            alert("Error al cargar usuarios");
        }
    };

    // ✅ Renderizar tabla
    const renderTabla = (data) => {
        tabla.innerHTML = `
            <table>
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
                      <button class="btn-eliminar" data-id="${u.id}">❌ Eliminar</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
        `;

        // Bind botones eliminar
        document.querySelectorAll(".btn-eliminar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                idEliminar = e.target.dataset.id;
                modalTexto.textContent = `¿Seguro que deseas eliminar al usuario con ID ${idEliminar}?`;
                modal.style.display = "block";
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
            password: document.getElementById("contrasena").value // 👈 corregido
        };

        try {
            await axios.post(`${API_URL}/usuarios/`, data);
            alert("Usuario registrado correctamente. Revisa tu correo para activación.");
            form.reset();
            cargarUsuarios();
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Error al registrar usuario");
        }
    });

    // ✅ Confirmar eliminación
    btnConfirmar.addEventListener("click", async () => {
        if (idEliminar) {
            try {
                await axios.delete(`${API_URL}/usuarios/${idEliminar}/`);
                alert("Usuario eliminado correctamente");
                modal.style.display = "none";
                cargarUsuarios();
            } catch (err) {
                console.error(err.response?.data || err);
                alert("Error al eliminar usuario");
            }
        }
    });

    btnCancelar.addEventListener("click", () => {
        modal.style.display = "none";
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

    // 🚀 Cargar al inicio
    cargarUsuarios();
});

// Simulación de sesión (cámbialo por tu lógica real de login)
const usuarioLogueado = true; // ponlo en false si no hay sesión

const perfilIcono = document.getElementById("perfil-icono");
if (usuarioLogueado && perfilIcono) {
  perfilIcono.style.display = "block"; // mostrar el icono si hay sesión
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

  // Cierra el menú si hago clic fuera
  document.addEventListener("click", (e) => {
    if (!perfilIcono.contains(e.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });
}
