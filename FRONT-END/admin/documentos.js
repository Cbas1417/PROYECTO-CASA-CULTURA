document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-usuario");
    const tabla = document.getElementById("tabla-usuarios");
    const buscador = document.getElementById("buscador");

    const modal = document.getElementById("modal-eliminar");
    const modalTexto = document.getElementById("modal-texto");
    const btnConfirmar = document.getElementById("btn-confirmar-eliminar");
    const btnCancelar = document.getElementById("btn-cancelar-eliminar");

    let usuarios = [];
    let indexEliminar = null;

    // ======================================
    // Cargar usuarios existentes desde el backend
    // ======================================
async function cargarUsuarios() {
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/usuarios/get_post");
        console.log("Datos crudos de usuarios:", response.data);

        // Ahora usamos response.data.data, que es el array real
        const dataArray = Array.isArray(response.data.data) ? response.data.data : [];

        usuarios = dataArray.map(u => ({
            documento: u.numero_documento,
            nombre: u.nombre,
            nacimiento: u.fecha_nacimiento,
            correo: u.correo,
            telefono: u.telefono,
            rol: u.rol
        }));

        renderizarUsuarios();
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        alert("No se pudieron cargar los usuarios existentes.");
    }
}

    // ======================================
    // Renderizar tabla de usuarios
    // ======================================
    function renderizarUsuarios() {
        tabla.innerHTML = "";
        const filtro = buscador.value.toLowerCase();

        usuarios
        .filter(u => 
            u.nombre.toLowerCase().includes(filtro) || 
            u.documento.toLowerCase().includes(filtro)
        )
        .slice(0, 15)
        .forEach((u, index) => {
            const fila = document.createElement("div");
            fila.classList.add("fila");

            fila.innerHTML = `
            <span>${u.nombre} - ${u.documento}</span>
            <span>Correo: ${u.correo}</span>
            <span>Tel: ${u.telefono}</span>
            <span>Rol: ${u.rol}</span>
            <span>Fecha nacimiento: ${u.nacimiento}</span>
            <button onclick="mostrarEliminar(${index})">🗑</button>
            `;

            tabla.appendChild(fila);
        });
    }

    // ======================================
    // Modal eliminar usuario
    // ======================================
    window.mostrarEliminar = (index) => {
        indexEliminar = index;
        modalTexto.textContent = `¿Eliminar a ${usuarios[index].nombre}?`;
        modal.classList.add("visible");
    };

    btnCancelar.addEventListener("click", () => {
        modal.classList.remove("visible");
        indexEliminar = null;
    });
<<<<<<< HEAD
}

/*despliegue menu*/
/* --- MENÚ PERFIL --- */
const userIcon = document.getElementById("user-icon");
const dropdownMenu = document.getElementById("dropdown-menu");

if (userIcon) {
  userIcon.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  // cerrar si se hace clic fuera
  document.addEventListener("click", (e) => {
    if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });
}
/* --- FIN MENÚ PERFIL --- */
=======

    btnConfirmar.addEventListener("click", () => {
        if (indexEliminar !== null) {
            usuarios.splice(indexEliminar, 1);
            renderizarUsuarios();
            modal.classList.remove("visible");
            indexEliminar = null;
        }
    });

    // ======================================
    // Crear usuario desde formulario
    // ======================================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nuevo = {
            documento: form.documento.value.trim(),
            nombre: form.nombre.value.trim(),
            nacimiento: form.nacimiento.value,
            correo: form.correo.value.trim(),
            telefono: form.telefono.value.trim(),
            rol: form.rol.value,
            contrasena: form.contrasena.value
        };

        usuarios.push(nuevo);
        form.reset();
        renderizarUsuarios();
    });

    // ======================================
    // Buscador en vivo
    // ======================================
    buscador.addEventListener("input", renderizarUsuarios);

    // ======================================
    // Menu adaptable
    // ======================================
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // ======================================
    // Crear usuario en backend
    // ======================================
    document.getElementById("form-usuario").addEventListener("submit", function(e) {
        e.preventDefault(); 

        const nuevoUsuario = {
            tipo_documento: document.getElementById("tipo_d").value,
            numero_documento: document.getElementById("documento").value.trim(),
            nombre: document.getElementById("nombre").value.trim(),
            fecha_nacimiento: document.getElementById("nacimiento").value,
            correo: document.getElementById("correo").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            rol: document.getElementById("rol").value,
            contraseña: document.getElementById("contrasena").value
        };

        axios.post("http://127.0.0.1:8000/api/v1/usuarios/get_post", nuevoUsuario, {
            headers: { "Content-Type": "application/json" }
        })
        .then(function(response) {
            console.log("Usuario creado correctamente:", response.data);
            alert("Usuario creado con éxito");
            e.target.reset();
        })
        .catch(function(error) {
            console.error("Error al enviar usuario:", error);
            alert("Error: " + (error.response?.data?.mensaje || "No se pudo crear el usuario"));
        });
    });

    // ======================================
    // Cargar usuarios al iniciar
    // ======================================
    cargarUsuarios();
});
>>>>>>> 5b6b709 (reload)
