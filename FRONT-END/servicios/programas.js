// Configuración
const API_BASE = "http://localhost:8000/";
let programasData = [];

// Elementos DOM
const programasContainer = document.getElementById('programas-container');
const filterButtons = document.querySelectorAll(".filters button");
const modal = document.getElementById("modal");
const tituloModal = document.getElementById("titulo-modal");
const descripcionModal = document.getElementById("descripcion-modal");
const formInscripcion = document.getElementById("form-inscripcion");
const contactoInscripcion = document.getElementById("contacto-inscripcion");
const btnInscribirse = document.getElementById("btn-inscribirse");
const btnIrIniciar = document.getElementById("btn-ir-iniciar");
const closeBtn = document.getElementById("close");

// Cargar programas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarProgramas();
    setupEventListeners();
    checkAuthStatus();
});

// Cargar programas desde el backend
async function cargarProgramas() {
    try {
        const response = await axios.get(`${API_BASE}api/programas/prog_forma/get_post/`);
        programasData = response.data;
        renderProgramas(programasData);
    } catch (error) {
        console.error("Error al cargar programas:", error);
        programasContainer.innerHTML = '<p class="error-message">Error al cargar los programas. Intenta nuevamente más tarde.</p>';
        
        // Cargar datos de ejemplo si hay error (para pruebas)
        cargarDatosEjemplo();
    }
}

// Función de respaldo con datos de ejemplo si el backend falla
function cargarDatosEjemplo() {
    programasData = [
        { id: 1, titulo: "Baile de salón", descripcion: "Aprende los bailes clásicos como vals, tango y más con instructores profesionales.", foto_programa: "../imagenes/images (1).jpg", categoria: "ece" },
        { id: 2, titulo: "Ballet", descripcion: "Explora la elegancia y técnica del ballet desde nivel principiante hasta avanzado.", foto_programa: "../imagenes/ballet.jpg", categoria: "ece" },
        { id: 3, titulo: "Teatro", descripcion: "Desarrolla tus habilidades actorales, expresión corporal y proyección escénica.", foto_programa: "../imagenes/Captura de pantalla 2025-05-16 150620.png", categoria: "ece" },
        { id: 4, titulo: "Baile urbano y moderno", descripcion: "Aprende los bailes urbanos como el hip hop, break dance y muchos mas.", foto_programa: "../imagenes/bailemo.jpg", categoria: "ece" },
        { id: 5, titulo: "Folclor", descripcion: "Aprende los bailes y ritmos de diferentes culturas y países.", foto_programa: "../imagenes/folclor.jpg", categoria: "ece" },
        { id: 6, titulo: "Banda", descripcion: "Aprende a tocar instrumentos de viento y percusión con nuestra banda.", foto_programa: "../imagenes/banda.jpg", categoria: "ece" },
        { id: 7, titulo: "Coro", descripcion: "Únete a un grupo coral donde desarrollarás tu voz, afinación y ritmo.", foto_programa: "../imagenes/coro.jpg", categoria: "ece" },
        { id: 8, titulo: "Cuerdas Andinas", descripcion: "Aprende a tocar instrumentos de cuerda como la quena, siku y muchos mas.", foto_programa: "../imagenes/cuerdas.jpg", categoria: "visu" },
        { id: 9, titulo: "Cuerdas frotadas", descripcion: "Aprende a tocar instrumentos de cuerda como la charango, bandola y muchos mas.", foto_programa: "../imagenes/frotadas.jpg", categoria: "visu" },
        { id: 10, titulo: "Artes plasticas", descripcion: "Aprende técnicas de pintura, dibujo, escultura y muchas más.", foto_programa: "../imagenes/plasticas.jpg", categoria: "visu" }
    ];
    renderProgramas(programasData);
}

// Renderizar programas en el DOM
function renderProgramas(programas) {
    programasContainer.innerHTML = '';
    
    programas.forEach(programa => {
        const programaElement = document.createElement('div');
        programaElement.className = 'programa';
        programaElement.dataset.id = programa.id;
        programaElement.dataset.category = programa.categoria || 'all';
        
        programaElement.innerHTML = `
            <img src="${programa.foto_programa || '../imagenes/placeholder.jpg'}" alt="${programa.titulo}">
            <h3>${programa.titulo}</h3>
            <a href="#" class="botonn" onclick="abrirModal(${programa.id})">Ver más</a>
        `;
        
        programasContainer.appendChild(programaElement);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            filterButtons.forEach(b => b.classList.toggle("active", b === button));
            filtrarProgramas(filter);
        });
    });
    
    // Modal
    closeBtn.addEventListener("click", cerrarModal);
    window.addEventListener("click", (e) => {
        if (e.target === modal) cerrarModal();
    });
    
    // Inscripción
    btnInscribirse.addEventListener("click", manejarInscripcion);
    
    // Menú responsive
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
}

// Filtrar programas
function filtrarProgramas(filter) {
    const programas = document.querySelectorAll('.programa');
    programas.forEach(programa => {
        const categoryMatches = filter === "all" || programa.dataset.category === filter;
        programa.style.display = categoryMatches ? "block" : "none";
    });
}

// Abrir modal con información del programa
function abrirModal(programaId) {
    const programa = programasData.find(p => p.id == programaId);
    if (!programa) return;
    
    tituloModal.textContent = programa.titulo;
    descripcionModal.textContent = programa.descripcion;
    
    const usuarioAutenticado = sessionStorage.getItem("usuarioLogueado") === "true";
    if (usuarioAutenticado) {
        formInscripcion.style.display = "block";
        btnIrIniciar.style.display = "none";
        contactoInscripcion.value = "";
    } else {
        formInscripcion.style.display = "none";
        btnIrIniciar.style.display = "inline-block";
    }
    
    modal.style.display = "flex";
    modal.dataset.programaId = programaId;
}

// Cerrar modal
function cerrarModal() {
    modal.style.display = "none";
}

// Manejar inscripción
async function manejarInscripcion() {
    const programaId = modal.dataset.programaId;
    const contacto = contactoInscripcion.value.trim();
    
    if (!contacto) {
        alert("Por favor ingresa tu correo electrónico o dirección de contacto.");
        return;
    }
    
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contacto)) {
        alert("Por favor ingresa un correo electrónico válido.");
        return;
    }
    
    try {
        const response = await axios.post(`${API_BASE}api/programas/inscribirse/${programaId}/`, {
            contacto: contacto,
            correo: contacto  // Enviar ambos campos para compatibilidad con el backend
        });
        
        if (response.data.estado === "ok" || response.data.success) {
            alert("✅ Te has inscrito correctamente. Revisa tu correo para más información.");
            cerrarModal();
        } else {
            alert("❌ Error al procesar la inscripción: " + (response.data.mensaje || response.data.message));
        }
    } catch (error) {
        console.error("Error en la inscripción:", error);
        
        // Simular éxito si el backend no está disponible (para pruebas)
        if (error.code === "ERR_NETWORK" || error.response?.status === 404) {
            if (confirm("¿Deseas simular una inscripción exitosa? (Backend no disponible)")) {
                alert("✅ Inscripción simulada. En un entorno real, recibirías un correo de confirmación.");
                cerrarModal();
            }
        } else {
            alert("❌ Hubo un error al procesar tu inscripción. Intenta nuevamente.");
        }
    }
}

// Verificar estado de autenticación
function checkAuthStatus() {
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

    // Manejar dropdown del perfil
    if (perfilDropdown) {
        perfilDropdown.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("hidden");
        });

        document.addEventListener("click", () => {
            dropdownMenu.classList.add("hidden");
        });
    }

    // Cerrar sesión
    if (cerrarSesion) {
        cerrarSesion.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("usuarioLogueado");
            window.location.reload();
        });
    }
}

// Botón para subir
const btnSubir = document.getElementById('btnSubir');
if (btnSubir) {
    window.addEventListener('scroll', () => {
        btnSubir.style.display = window.scrollY > 200 ? 'inline-block' : 'none';
    });

    btnSubir.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Función original de inscribirse (para compatibilidad con onclick en HTML)
function inscribirse(programaId, programaTitulo) {
    // Buscar el programa en los datos cargados
    const programa = programasData.find(p => p.id == programaId);
    if (programa) {
        abrirModal(programaId);
    } else {
        // Si no está en los datos, crear un modal básico
        tituloModal.textContent = programaTitulo;
        descripcionModal.textContent = "Información detallada sobre " + programaTitulo;
        
        const usuarioAutenticado = sessionStorage.getItem("usuarioLogueado") === "true";
        if (usuarioAutenticado) {
            formInscripcion.style.display = "block";
            btnIrIniciar.style.display = "none";
            contactoInscripcion.value = "";
        } else {
            formInscripcion.style.display = "none";
            btnIrIniciar.style.display = "inline-block";
        }
        
        modal.style.display = "flex";
        modal.dataset.programaId = programaId;
    }
}