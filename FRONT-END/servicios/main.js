// Variables del juego
const simbolos = ['🎃', '👻', '🕷️', '🦇', '💀', '🕸️', '😱', '🧟'];
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

// Inicializar el juego
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

// Destapar una carta
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

// Verificar si las cartas hacen par
function verificarPar() {
    const [primera, segunda] = cartasDestapadas;

    if (cartas[primera] === cartas[segunda]) {
        cartas[primera] = null;
        cartas[segunda] = null;
        aciertos++;
        actualizarAciertos();
        sonidoMatch.play();

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

// Actualizar estadísticas
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

// Botón para reiniciar el juego manualmente
const reiniciarBtn = document.getElementById('reiniciar-btn');
if (reiniciarBtn) {
    reiniciarBtn.addEventListener('click', () => {
        iniciarJuego();
    });
}

// Reemplazar alert con modal simple para mensajes de fin de juego
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
    btnCerrar.style.listStyle = 'none';
    btnCerrar.style.textAlign = 'center';
    btnCerrar.style.display = 'inline-block';
    btnCerrar.style.lineHeight = '1.3';

    btnCerrar.addEventListener('click', () => {
        document.body.removeChild(mensaje);
        iniciarJuego();
    });

    mensaje.appendChild(btnCerrar);
    document.body.appendChild(mensaje);
}
