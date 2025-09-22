const filterButtons = document.querySelectorAll(".filters button");
const galleryItems = document.querySelectorAll(".programa");

// Filtrado de programas
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filterButtons.forEach(b => b.classList.toggle("active", b === button));
        galleryItems.forEach(item => {
            const categoryMatches = filter === "all" || item.dataset.category === filter;
            item.style.display = categoryMatches ? "block" : "none";
        });
    });
});

// Menú adaptable
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}

// Descripciones de programas
const descripciones = {
    baile: { titulo: "Baile de salón", texto: "Aprende los bailes clásicos como vals, tango y más con instructores profesionales." },
    ballet: { titulo: "Ballet", texto: "Explora la elegancia y técnica del ballet desde nivel principiante hasta avanzado." },
    teatro: { titulo: "Teatro", texto: "Desarrolla tus habilidades actorales, expresión corporal y proyección escénica." },
    coro: { titulo: "Coro", texto: "Únete a un grupo coral donde desarrollarás tu voz, afinación y ritmo." },
    baileurba: { titulo: "Baile Urbano", texto: "Aprende los bailes urbanos como el hip hop, break dance y muchos mas." },
    folclor: { titulo: "Folclor", texto: "Aprende los bailes y ritmos de diferentes culturas y países." },
    banda: { titulo: "Banda", texto: "Aprende a tocar instrumentos de viento y percusión con nuestra banda." },
    cuerdaan: { titulo: "Cuerdas andinas", texto: "Aprende a tocar instrumentos de cuerda como la quena, siku y muchos mas." },
    cuerdafro: { titulo: "Cuerdas frotadas", texto: "Aprende a tocar instrumentos de cuerda como la charango, bandola y muchos mas." },
    artes: { titulo: "Artes plasticas", texto: "Aprende técnicas de pintura, dibujo, escultura y muchas más." }
};

// Elementos del modal
const modal = document.getElementById("modal");
const titulo = document.getElementById("titulo-modal");
const descripcion = document.getElementById("descripcion-modal");
const formInscripcion = document.getElementById("form-inscripcion");
const btnIrIniciar = document.getElementById("btn-ir-iniciar");
const closeBtn = document.getElementById("close");
const btnInscribirse = document.getElementById("btn-inscribirse");
const contactoInput = document.getElementById("contacto-inscripcion");
const nombreInput = document.getElementById("nombre-inscripcion");
const edadInput = document.getElementById("edad-inscripcion");

// Verificar autenticación
const usuarioAutenticado = sessionStorage.getItem("usuarioLogueado") === "true";

// Configurar eventos para los programas
const programas = document.querySelectorAll(".programa");
programas.forEach(p => {
    p.querySelector('.botonn').addEventListener('click', e => {
        e.preventDefault();
        const id = p.dataset.id;

        if (descripciones[id]) {
            titulo.textContent = descripciones[id].titulo;
            descripcion.textContent = descripciones[id].texto;
            modal.style.display = "flex";

            modal.dataset.programaId = id;
            modal.dataset.programaNombre = descripciones[id].titulo;

            if (usuarioAutenticado) {
                formInscripcion.style.display = "block";
                btnIrIniciar.style.display = "none";
            } else {
                formInscripcion.style.display = "none";
                btnIrIniciar.style.display = "inline-block";
            }
        }
    });
});

// Cerrar modal
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

// Cerrar modal al hacer clic fuera
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

// Mostrar/ocultar sección de inscripciones
function toggleSeccionInscripciones() {
    const seccion = document.getElementById('mis-inscripciones-section');
    const estaLogueado = sessionStorage.getItem('usuarioLogueado') === 'true';
    if (seccion) {
        if (estaLogueado) {
            seccion.style.display = 'block';
            cargarInscripciones();
        } else {
            seccion.style.display = 'none';
        }
    }
}

// Cargar inscripciones en tabla
function cargarInscripciones() {
    const inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
    const cuerpo = document.getElementById('inscripciones-body');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    const tabla = document.getElementById('tabla-inscripciones');

    if (inscripciones.length === 0) {
        if (mensajeVacio) mensajeVacio.style.display = 'block';
        if (cuerpo) cuerpo.innerHTML = '';
        if (tabla) tabla.style.display = 'none';
    } else {
        if (mensajeVacio) mensajeVacio.style.display = 'none';
        if (tabla) tabla.style.display = 'table';
        if (cuerpo) {
            cuerpo.innerHTML = inscripciones.map(i => `
                <tr>
                    <td>${i.programaNombre}</td>
                    <td>${i.nombre} (${i.edad})<br>${i.correo}</td>
                    <td>${i.fecha}</td>
                </tr>
            `).join('');
        }
    }
}

// === Guardar nombre, edad y correo ===
function simularInscripcion(programaId, programaNombre, correo, nombre, edad) {
    try {
        let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
        const duplicado = inscripciones.some(i => i.programaId === programaId && i.correo === correo);
        if (duplicado) {
            document.getElementById("modalYaInscrito").style.display = "block";
            return false;
        }
        const inscripcion = {
            id: Date.now(),
            programaId,
            programaNombre,
            correo,
            nombre,
            edad,
            fecha: new Date().toLocaleString()
        };
        inscripciones.push(inscripcion);
        localStorage.setItem('inscripciones', JSON.stringify(inscripciones));
        cargarInscripciones();
        return true;
    } catch (err) {
        console.error("Error al guardar inscripción:", err);
        return false;
    }
}

// === Cargar inscripciones en tabla con columnas separadas ===
function cargarInscripciones() {
    const inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
    const cuerpo = document.getElementById('inscripciones-body');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    const tabla = document.getElementById('tabla-inscripciones');

    if (inscripciones.length === 0) {
        if (mensajeVacio) mensajeVacio.style.display = 'block';
        if (cuerpo) cuerpo.innerHTML = '';
        if (tabla) tabla.style.display = 'none';
    } else {
        if (mensajeVacio) mensajeVacio.style.display = 'none';
        if (tabla) tabla.style.display = 'table';
        if (cuerpo) {
            cuerpo.innerHTML = inscripciones.map(i => `
                <tr>
                    <td>${i.programaNombre}</td>
                    <td>${i.nombre}</td>
                    <td>${i.edad}</td>
                    <td>${i.correo}</td>
                    <td>${i.fecha}</td>
                </tr>
            `).join('');
        }
    }
}


// Confirmación
function mostrarConfirmacion() {
    document.getElementById("modalYaInscrito").style.display = "block";
}

// Modal "ya inscrito"
const modalYaInscrito = document.getElementById("modalYaInscrito");
const closeYaInscrito = document.getElementById("closeYaInscrito");
if (closeYaInscrito) {
    closeYaInscrito.onclick = () => modalYaInscrito.style.display = "none";
}
window.onclick = function(event) {
    if (event.target === modalYaInscrito) modalYaInscrito.style.display = "none";
};

// Botón confirmar inscripción
if (btnInscribirse) {
    btnInscribirse.addEventListener('click', function() {
        const programaId = modal.dataset.programaId;
        const programaNombre = modal.dataset.programaNombre;
        const correo = contactoInput ? contactoInput.value.trim() : "";
        const nombre = nombreInput ? nombreInput.value.trim() : "";
        const edad = edadInput ? edadInput.value.trim() : "";

        if (!correo || !nombre || !edad) {
            alert("Por favor completa todos los campos.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            alert("Por favor ingresa un correo electrónico válido.");
            return;
        }
        if (simularInscripcion(programaId, programaNombre, correo, nombre, edad)) {
            modal.style.display = 'none';
            contactoInput.value = "";
            nombreInput.value = "";
            edadInput.value = "";
            mostrarConfirmacion();
        }
    });
}

// Gestión de usuario
document.addEventListener("DOMContentLoaded", () => {
    const btnIniciar = document.getElementById("btn-iniciar");
    const btnRegistrar = document.getElementById("btn-registrar");
    const perfilDropdown = document.getElementById("perfil-icono");
    const estaLogueado = sessionStorage.getItem("usuarioLogueado") === "true";
    if (estaLogueado) {
        if (btnIniciar) btnIniciar.style.display = "none";
        if (btnRegistrar) btnRegistrar.style.display = "none";
        if (perfilDropdown) perfilDropdown.style.display = "inline-block";
    } else {
        if (btnIniciar) btnIniciar.style.display = "inline-block";
        if (btnRegistrar) btnRegistrar.style.display = "inline-block";
        if (perfilDropdown) perfilDropdown.style.display = "none";
    }
    toggleSeccionInscripciones();
});

document.addEventListener("DOMContentLoaded", () => {
  const btnIniciar = document.getElementById("btn-iniciar");
  const btnRegistrar = document.getElementById("btn-registrar");
  const perfilIcono = document.getElementById("perfil-icono");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const cerrarSesion = document.getElementById("cerrar-sesion");

  // Usamos siempre sessionStorage (puedes cambiarlo por localStorage si quieres)
  const estaLogueado = sessionStorage.getItem("usuarioLogueado") === "true";

  if (estaLogueado) {
    if (btnIniciar) btnIniciar.style.display = "none";
    if (btnRegistrar) btnRegistrar.style.display = "none";
    if (perfilIcono) perfilIcono.style.display = "inline-block";
  } else {
    if (btnIniciar) btnIniciar.style.display = "inline-block";
    if (btnRegistrar) btnRegistrar.style.display = "inline-block";
    if (perfilIcono) perfilIcono.style.display = "none";
  }

  // Toggle del menú de perfil
  if (perfilIcono && dropdownMenu) {
    perfilIcono.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("hidden");
    });

    // Ocultar si hago clic fuera
    document.addEventListener("click", (e) => {
      if (!perfilIcono.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });
  }

  // Cerrar sesión
  if (cerrarSesion) {
    cerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "programas.html"; // redirige o recarga
    });
  }
});
