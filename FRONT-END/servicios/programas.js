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
    baile: {
        titulo: "Baile de salón",
        texto: "Aprende los bailes clásicos como vals, tango y más con instructores profesionales."
    },
    ballet: {
        titulo: "Ballet",
        texto: "Explora la elegancia y técnica del ballet desde nivel principiante hasta avanzado."
    },
    teatro: {
        titulo: "Teatro",
        texto: "Desarrolla tus habilidades actorales, expresión corporal y proyección escénica."
    },
    coro: {
        titulo: "Coro",
        texto: "Únete a un grupo coral donde desarrollarás tu voz, afinación y ritmo."
    },
    baileurba: {
        titulo: "Baile Urbano",
        texto: "Aprende los bailes urbanos como el hip hop, break dance y muchos mas."
    },
    folclor: {
        titulo: "Folclor",
        texto: "Aprende los bailes y ritmos de diferentes culturas y países."
    },
    banda: {
        titulo: "Banda",
        texto: "Aprende a tocar instrumentos de viento y percusión con nuestra banda."
    },
    cuerdaan: {
        titulo: "Cuerdas andinas",
        texto: "Aprende a tocar instrumentos de cuerda como la quena, siku y muchos mas."
    },
    cuerdafro: {
        titulo: "Cuerdas frotadas",
        texto: "Aprende a tocar instrumentos de cuerda como la charango, bandola y muchos mas."
    },
    artes: {
        titulo: "Artes plasticas",
        texto: "Aprende técnicas de pintura, dibujo, escultura y muchas más."
    }
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

// Cerrar modal al hacer clic fuera de él
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Función para mostrar/ocultar la sección de inscripciones
function toggleSeccionInscripciones() {
    const seccionInscripciones = document.getElementById('mis-inscripciones-section');
    const estaLogueado = sessionStorage.getItem('usuarioLogueado') === 'true';
    
    if (seccionInscripciones) {
        if (estaLogueado) {
            seccionInscripciones.style.display = 'block';
            cargarInscripciones();
        } else {
            seccionInscripciones.style.display = 'none';
        }
    }
}

// Función para cargar las inscripciones en la tabla
function cargarInscripciones() {
    const inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
    const cuerpoTabla = document.getElementById('inscripciones-body');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    const tabla = document.getElementById('tabla-inscripciones');
    
    if (inscripciones.length === 0) {
        if (mensajeVacio) mensajeVacio.style.display = 'block';
        if (cuerpoTabla) cuerpoTabla.innerHTML = '';
        if (tabla) tabla.style.display = 'none';
    } else {
        if (mensajeVacio) mensajeVacio.style.display = 'none';
        if (tabla) tabla.style.display = 'table';
        
        if (cuerpoTabla) {
            cuerpoTabla.innerHTML = inscripciones.map((insc, index) => `
                <tr>
                    <td>${insc.programaNombre}</td>
                    <td>${insc.contacto}</td>
                    <td>${insc.fecha}</td>
                </tr>
            `).join('');
        }
    }
}


// Función para simular la inscripción (modificada para recargar la tabla después de inscribirse)
function simularInscripcion(programaId, programaNombre, contacto) {
    try {
        // Obtener inscripciones existentes o inicializar array vacío
        let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
        
        // Crear objeto de inscripción
        const inscripcion = {
            id: Date.now(), // ID único basado en timestamp
            programaId: programaId,
            programaNombre: programaNombre,
            contacto: contacto,
            fecha: new Date().toLocaleString()
        };
        
        // Agregar la nueva inscripción
        inscripciones.push(inscripcion);
        
        // Guardar en localStorage
        localStorage.setItem('inscripciones', JSON.stringify(inscripciones));
        
        // Recargar la tabla de inscripciones
        cargarInscripciones();
        
        console.log("Inscripción simulada guardada:", inscripcion);
        return true;
    } catch (error) {
        console.error("Error al guardar la inscripción:", error);
        return false;
    }
}

// Función para mostrar mensaje de confirmación
function mostrarConfirmacion(programaNombre) {
    document.getElementById("modalYaInscrito").style.display = "block";
}
// Modal de "ya inscrito"
const modalYaInscrito = document.getElementById("modalYaInscrito");
const closeYaInscrito = document.getElementById("closeYaInscrito");

closeYaInscrito.onclick = function() {
  modalYaInscrito.style.display = "none";
}

window.onclick = function(event) {
  if (event.target === modalYaInscrito) {
    modalYaInscrito.style.display = "none";
  }
}


// Configurar evento para el botón de inscripción
if (btnInscribirse) {
    btnInscribirse.addEventListener('click', function() {
        const programaId = modal.dataset.programaId;
        const programaNombre = modal.dataset.programaNombre;
        const contacto = contactoInput ? contactoInput.value : '';
        
        if (!contacto) {
            alert('Por favor, ingresa un correo electrónico o dirección donde deseas recibir la información.');
            return;
        }
        
        // Validar formato de correo si es email
        if (contacto.includes('@') && !contacto.includes(' ')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contacto)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }
        }
        
        // Simular la inscripción
        if (simularInscripcion(programaId, programaNombre, contacto)) {
            mostrarConfirmacion(programaNombre);
            modal.style.display = 'none';
            
            // Limpiar el campo de contacto
            if (contactoInput) contactoInput.value = '';
        } else {
            alert('Error en la inscripción. Por favor, intenta nuevamente.');
        }
    });
}

// Gestión de usuario
document.addEventListener("DOMContentLoaded", () => {
    const btnIniciar = document.getElementById("btn-iniciar");
    const btnRegistrar = document.getElementById("btn-registrar");
    const perfilDropdown = document.getElementById("perfil-icono");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const cerrarSesion = document.getElementById("cerrar-sesion");

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

    if (perfilDropdown) {
        perfilDropdown.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("hidden");
        });

        dropdownMenu.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        document.addEventListener("click", () => {
            dropdownMenu.classList.add("hidden");
        });
    }

    if (cerrarSesion) {
        cerrarSesion.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("usuarioLogueado");
            // Ocultar la sección de inscripciones al cerrar sesión
            toggleSeccionInscripciones();
            window.location.href = "programas.html";
        });
    }

    if (btnRegistrar) {
        btnRegistrar.addEventListener("click", () => {
            sessionStorage.setItem("paginaAnterior", window.location.href);
        });
    }
    
    // Mostrar/ocultar sección de inscripciones al cargar la página
    toggleSeccionInscripciones();
});

// Botón para subir
const btnSubir = document.getElementById('btnSubir');
if (btnSubir) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            btnSubir.style.display = 'inline-block';
        } else {
            btnSubir.style.display = 'none';
        }
    });

    btnSubir.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}