// Variables del juego
const simbolos = ['🎃', '👻', '🕷️', '🦇', '💀', '🕸️', '😱', '🧟'];
let cartas = [];
let cartasDestapadas = [];
let aciertos = 0;
let movimientos = 0;
let tiempoRestante = 120;
let temporizador = null;
let bloqueo = false;
let juegoIniciado = false; // nuevo: controlar el inicio del cronómetro

// Inicializar el juego
function iniciarJuego() {
    // Crear pares de símbolos y mezclarlos
    cartas = [...simbolos, ...simbolos].sort(() => Math.random() - 0.5);

    // Reiniciar variables
    cartasDestapadas = [];
    aciertos = 0;
    movimientos = 0;
    tiempoRestante = 120;
    juegoIniciado = false;

    // Reiniciar botones
    document.querySelectorAll('.seccion1 button').forEach(boton => {
        boton.textContent = '';
        boton.disabled = false;
    });

    actualizarEstadisticas();

    // Limpiar temporizador anterior
    clearInterval(temporizador);
}

// Destapar una carta
function destapar(index) {
    if (bloqueo || cartasDestapadas.includes(index) || cartas[index] === null) return;

    const boton = document.getElementById(index);
    boton.textContent = cartas[index];

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

// Verificar si las cartas hacen par
function verificarPar() {
    const [primera, segunda] = cartasDestapadas;

    if (cartas[primera] === cartas[segunda]) {
        cartas[primera] = null;
        cartas[segunda] = null;
        aciertos++;
        actualizarAciertos();

        if (aciertos === simbolos.length) {
            finDelJuego(true);
        }
    } else {
        setTimeout(() => {
            document.getElementById(primera).textContent = '';
            document.getElementById(segunda).textContent = '';
        }, 1000);
    }

    cartasDestapadas = [];
    setTimeout(desbloquearJuego, 1000);
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    actualizarAciertos();
    actualizarTemporizador();
    actualizarMovimientos(true); // indicar que es inicial
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

// Control de flujo del juego
function bloquearJuego() {
    bloqueo = true;
}

function desbloquearJuego() {
    bloqueo = false;
}

function finDelJuego(victoria) {
    clearInterval(temporizador);
    setTimeout(() => {
        alert(victoria 
            ? `¡Ganaste! 🎉\nMovimientos: ${movimientos}\nTiempo restante: ${tiempoRestante}s`
            : `¡Tiempo agotado! ⏰\nAciertos: ${aciertos}/${simbolos.length}`);
        iniciarJuego();
    }, 100);
}

// Iniciar el juego al cargar la página
document.addEventListener('DOMContentLoaded', iniciarJuego);


/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}


//logueo
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
        e.stopPropagation(); // evita que se cierre al hacer clic dentro del menú
      });

      document.addEventListener("click", () => {
        dropdownMenu.classList.add("hidden");
      });
    }

    if (cerrarSesion) {
      cerrarSesion.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("usuarioLogueado");
        window.location.href = "index.html"; // recarga la misma página
      });
    }

    if (btnRegistrar) {
      btnRegistrar.addEventListener("click", () => {
        sessionStorage.setItem("paginaAnterior", window.location.href);
      });
    }
  });

