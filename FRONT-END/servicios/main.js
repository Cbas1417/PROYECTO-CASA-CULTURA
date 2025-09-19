// =============================
// VARIABLES DEL JUEGO
// =============================

// Lista de personajes culturales
// Personajes culturales de Caldas (Antioquia)
// Personajes culturales de Caldas (Antioquia)

const personajes = [
  { 
    simbolo: '📖', 
    imagen: '../imagenes/ciro_mendia.jpg', 
    descripcion: 'Ciro Mendía (Carlos Edmundo Mejía Ángel, 1892). Poeta y dramaturgo caldense, autor de obras como “Caballito de siete colores” y “La Golondrina de cristal”. Considerado uno de los grandes exponentes de la poesía antioqueña.' 
  },
  { 
    simbolo: '✍️', 
    imagen: '../imagenes/marco-mejia-3.jpg', 
    descripcion: 'Marco Antonio Mejía Torres (1956). Poeta, ensayista y realizador audiovisual caldense. Autor de “La Fragancia de la Identidad” y “Cuerno de Imagen”. Reconocido por su aporte al ensayo latinoamericano.' 
  },
  { 
    simbolo: '📰', 
    imagen: '../imagenes/Carlos mario correa soto.jpg', 
    descripcion: 'Carlos Mario Correa Soto. Comunicador social y periodista caldense. Fue corresponsal de El Espectador en Medellín y ha trabajado en El Mundo y Caracol Radio, destacándose en periodismo investigativo.' 
  },
  { 
    simbolo: '📚', 
    imagen: '../imagenes/luis eduardo yepes.jpg', 
    descripcion: 'Luis Eduardo Yepes. Historiador local de Caldas, dedicado a la preservación de la memoria histórica a través del Centro de Historia Tres Aguas.' 
  },
  { 
    simbolo: '🎭', 
    imagen: '../imagenes/ociel gartner.jpg', 
    descripcion: 'Cruz Ociel Gärtner Restrepo. Poeta, escritor, educador y político nacido en Riosucio, Caldas (1940-2020). Conocido por su aporte literario y cultural al Carnaval de Riosucio.', 
  },
  { 
    simbolo: '👥', 
    imagen: '../imagenes/Alberto pino.jpg', 
    descripcion: 'Alberto Pino Gil. Artista, muralista e ilustrador nacido en Salamina en 1918. Fundador de la Facultad de Arte de la Universidad de Caldas, dejó huella en la plástica regional.' 
  },
  { 
    simbolo: '🌿', 
    imagen: '../imagenes/blanca izasa.jpg', 
    descripcion: 'Blanca Isaza de Jaramillo Meza. Poetisa que vivió gran parte de su vida en Manizales, vinculada a la literatura del Viejo Caldas. Reconocida editora y figura clave en la poesía regional.' 
  },
  { 
    simbolo: '🎶', 
    imagen: '../imagenes/_julian_bueno.png', 
    descripcion: 'Julián Bueno Rodríguez. Folclorólogo e investigador caldense. Fundador de Danzas del Ingrumá en Riosucio, pionero en rescatar y difundir la danza tradicional en festivales nacionales e internacionales.' 
  }
];

// =============================
// Símbolos del tablero (solo usamos los íconos)
// =============================
const simbolos = personajes.map(p => p.simbolo);


let cartas = [];
let cartasDestapadas = [];
let aciertos = 0;
let movimientos = 0;
let tiempoRestante = 120;
let temporizador = null;
let bloqueo = false;
let juegoIniciado = false;

// Efectos de sonido
const sonidoFlip = new Audio('../imagenes/flipcard-91468.mp3');
const sonidoMatch = new Audio('../imagenes/rv7w6pk4m1-game-sfx-2.mp3');
const sonidoFail = new Audio('../sounds/rvf1r6ncd6-right-buzzer-sfx-3.mp3');
const sonidoWin = new Audio('../imagenes/you-win-sequence-1-183948.mp3');

// =============================
// INICIAR JUEGO
// =============================
function iniciarJuego() {
    cartas = [...simbolos, ...simbolos].sort(() => Math.random() - 0.5);
    cartasDestapadas = [];
    aciertos = 0;
    movimientos = 0;
    tiempoRestante = 120;
    juegoIniciado = false;

    document.querySelectorAll('.seccion1 button').forEach(boton => {
        boton.textContent = '';
        boton.disabled = false;
    });

    actualizarEstadisticas();
    clearInterval(temporizador);
}

// =============================
// DESTAPAR CARTA
// =============================
function destapar(index) {
    if (bloqueo || cartasDestapadas.includes(index) || cartas[index] === null) return;

    const boton = document.getElementById(index);
    boton.textContent = cartas[index];
    sonidoFlip.play();

    cartasDestapadas.push(index);

    if (!juegoIniciado) {
        juegoIniciado = true;
        temporizador = setInterval(actualizarTemporizador, 1000);
    }

    if (cartasDestapadas.length === 2) {
        bloquearJuego();
        verificarPar();
        actualizarMovimientos();
    }
}

// =============================
// VERIFICAR PAREJA
// =============================
function verificarPar() {
    const [primera, segunda] = cartasDestapadas;

    if (cartas[primera] === cartas[segunda]) {
        const simbolo = cartas[primera];
        cartas[primera] = null;
        cartas[segunda] = null;
        aciertos++;
        actualizarAciertos();
        sonidoMatch.play();

        // Mostrar modal del personaje
        mostrarModalPersonaje(simbolo);

        if (aciertos === simbolos.length) {
            sonidoWin.play();
            finDelJuego(true);
        }
    } else {
        sonidoFail.play();
        setTimeout(() => {
            document.getElementById(primera).textContent = '';
            document.getElementById(segunda).textContent = '';
        }, 1000);
    }

    cartasDestapadas = [];
    setTimeout(desbloquearJuego, 1000);
}

// =============================
// ACTUALIZAR ESTADÍSTICAS
// =============================
function actualizarEstadisticas() {
    actualizarAciertos();
    actualizarTemporizador();
    actualizarMovimientos(true);
}

function actualizarAciertos() {
    document.getElementById('aciertos').textContent = `Aciertos: ${aciertos}`;
}

function actualizarMovimientos(inicial = false) {
    if (!inicial) movimientos++;
    document.getElementById('movimientos').textContent = `Movimientos: ${movimientos}`;
}

function actualizarTemporizador() {
    tiempoRestante--;
    document.getElementById('t-restante').textContent = `Tiempo: ${tiempoRestante} segundos`;

    if (tiempoRestante <= 0) {
        finDelJuego(false);
    }
}

function bloquearJuego() {
    bloqueo = true;
}

function desbloquearJuego() {
    bloqueo = false;
}

function finDelJuego(victoria) {
    clearInterval(temporizador);
    setTimeout(() => {
        mostrarMensajeFin(victoria);
    }, 100);
}

document.addEventListener('DOMContentLoaded', iniciarJuego);

// =============================
// MODAL DE PERSONAJES (EPIC VERSION)
// =============================
function mostrarModalPersonaje(simbolo) {
    const personaje = personajes.find(p => p.simbolo === simbolo);
    if (!personaje) return;

    // Crear modal dinámico
    const modal = document.createElement('div');
    modal.classList.add('modal-epico');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '2000';

    const contenido = document.createElement('div');
    contenido.classList.add('contenido-epico');
    contenido.style.background = '#fff';
    contenido.style.padding = '20px';
    contenido.style.borderRadius = '15px';
    contenido.style.width = '320px';
    contenido.style.textAlign = 'center';
    contenido.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)';

    const img = document.createElement('img');
    img.src = personaje.imagen;
    img.alt = 'Personaje';
    img.style.maxWidth = '180px';
    img.style.marginBottom = '15px';
    img.style.borderRadius = '12px';
    img.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';

    const texto = document.createElement('p');
    texto.textContent = personaje.descripcion;
    texto.style.fontSize = "1.05rem";
    texto.style.marginBottom = "15px";

    const btnCerrar = document.createElement('button');
    btnCerrar.textContent = 'Cerrar';
    btnCerrar.style.marginTop = '10px';
    btnCerrar.style.padding = '12px 10px';
    btnCerrar.style.border = 'none';
    btnCerrar.style.borderRadius = '10px';
    btnCerrar.style.cursor = 'pointer';
    btnCerrar.style.backgroundColor = '#ff7043';
    btnCerrar.style.color = 'white';
    btnCerrar.style.fontSize = '16px';
    btnCerrar.style.transition = "transform 0.2s";
    btnCerrar.onmouseover = () => btnCerrar.style.transform = "scale(1.1)";
    btnCerrar.onmouseout = () => btnCerrar.style.transform = "scale(1)";

    // Cierre con animación
    btnCerrar.addEventListener('click', () => {
        modal.classList.remove('modal-epico');
        modal.classList.add('modal-epico-out');
        setTimeout(() => document.body.removeChild(modal), 400);
    });

    contenido.appendChild(img);
    contenido.appendChild(texto);
    contenido.appendChild(btnCerrar);
    modal.appendChild(contenido);
    document.body.appendChild(modal);
}


// =============================
// MENÚ ADAPTABLE
// =============================
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}

// =============================
// LOGIN
// =============================
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
            window.location.href = "index.html";
        });
    }

    if (btnRegistrar) {
        btnRegistrar.addEventListener("click", () => {
            sessionStorage.setItem("paginaAnterior", window.location.href);
        });
    }
});

// =============================
// REINICIAR JUEGO
// =============================
const reiniciarBtn = document.getElementById('reiniciar-btn');
if (reiniciarBtn) {
    reiniciarBtn.addEventListener('click', () => {
        iniciarJuego();
    });
}

// =============================
// MODAL DE FIN DE JUEGO
// =============================
function mostrarMensajeFin(victoria) {
    const mensaje = document.createElement('div');
    mensaje.style.position = 'fixed';
    mensaje.style.top = '50%';
    mensaje.style.left = '50%';
    mensaje.style.transform = 'translate(-50%, -50%)';
    mensaje.style.backgroundColor = 'white';
    mensaje.style.padding = '30px 40px';
    mensaje.style.borderRadius = '15px';
    mensaje.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
    mensaje.style.textAlign = 'center';
    mensaje.style.zIndex = '1000';
    mensaje.style.fontSize = '1.25rem';
    mensaje.style.color = '#4e342e';

    if (victoria) {
        mensaje.innerHTML = `<p>¡Ganaste! 🎉</p>
                            <p>Movimientos: ${movimientos}</p>
                            <p>Tiempo restante: ${tiempoRestante}s</p>`;
    } else {
        mensaje.innerHTML = `<p>¡Tiempo agotado! ⏰</p>
                            <p>Aciertos: ${aciertos}/${simbolos.length}</p>`;
    }

    const btnCerrar = document.createElement('button');
    btnCerrar.textContent = 'Cerrar';
    btnCerrar.style.marginTop = '20px';
    btnCerrar.style.padding = '12px 30px';
    btnCerrar.style.border = 'none';
    btnCerrar.style.width = '150px';
    btnCerrar.style.borderRadius = '10px';
    btnCerrar.style.cursor = 'pointer';
    btnCerrar.style.backgroundColor = '#ffb74d';
    btnCerrar.style.fontWeight = '200';
    btnCerrar.style.color = '#4e342e';
    btnCerrar.style.fontSize = "22px";

    btnCerrar.addEventListener('click', () => {
        document.body.removeChild(mensaje);
        iniciarJuego();
    });

    mensaje.appendChild(btnCerrar);
    document.body.appendChild(mensaje);
}

// =============================
// BOTÓN SUBIR
// =============================
const btnSubire = document.getElementById('btnSubire');
if (btnSubire) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            btnSubire.style.display = 'inline-block';
        } else {
            btnSubire.style.display = 'none';
        }
    });

    btnSubire.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}