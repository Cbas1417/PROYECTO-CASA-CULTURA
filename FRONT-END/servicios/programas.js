const filterButtons = document.querySelectorAll(".filters button");
const galleryItems  = document.querySelectorAll(".programa");


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
/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});



//para no repetir pagina
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
  // Agrega más entradas según tus programas...
};

const programas = document.querySelectorAll('.programa');
const modal = document.getElementById('modal');
const titulo = document.getElementById('modal-titulo');
const descripcion = document.getElementById('modal-descripcion');
const cerrar = document.getElementById('cerrar-modal');

programas.forEach(p => {
  p.querySelector('.botonn').addEventListener('click', e => {
    e.preventDefault();
    const id = p.dataset.id;
    if (descripciones[id]) {
      titulo.textContent = descripciones[id].titulo;
      descripcion.textContent = descripciones[id].texto;
      modal.style.display = "flex";
    }
  });
});

cerrar.addEventListener('click', () => {
  modal.style.display = "none";
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


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
