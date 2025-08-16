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


//inscripcion
const programas = document.querySelectorAll(".programa");
const modal = document.getElementById("modal");
const titulo = document.getElementById("titulo-modal");
const descripcion = document.getElementById("descripcion-modal");
const formInscripcion = document.getElementById("form-inscripcion");
const btnIrIniciar = document.getElementById("btn-ir-iniciar");
const closeBtn = document.getElementById("close");

const usuarioAutenticado = sessionStorage.getItem("usuarioLogueado") === "true";


programas.forEach(p => {
    p.querySelector('.botonn').addEventListener('click', e => {
      e.preventDefault();
      const id = p.dataset.id;

      if (descripciones[id]) {
        titulo.textContent = descripciones[id].titulo;
        descripcion.textContent = descripciones[id].texto;
        modal.style.display = "flex";

        modal.dataset.programaId = id;

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
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Confirmar inscripción
  document.getElementById("btn-inscribirse").addEventListener("click", () => {
    const contacto = document.getElementById("contacto-inscripcion").value.trim();
    const programaId = modal.dataset.programaId;

    if (!contacto) {
      alert("Por favor, escribe tu correo o dirección de contacto.");
      return;
    }

    console.log(`📨 Inscripción enviada`);
    console.log(`Programa ID: ${programaId}`);
    console.log(`Contacto del usuario: ${contacto}`);

    alert("✅ ¡Te has inscrito exitosamente!");
    modal.style.display = "none";
    document.getElementById("contacto-inscripcion").value = "";
  });
//no me acuerdo
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







//conexion, lo mas probable, no se
axios.get("http://localhost:8000/api/programas/prog_forma/get_post")
  .then(res => {
    console.log(res.data.data);  // ← 'data' viene del JsonResponse en tu view
  });


// POST
const formDataPost = new FormData();
formDataPost.append("titulo", "Título nuevo");
formDataPost.append("descripcion", "Descripción larga");
formDataPost.append("foto_programa", archivoInput.files[0]);

axios.post("http://localhost:8000/api/programas/prog_forma/get_post", formDataPost, {
  headers: { "Content-Type": "multipart/form-data" }
})
.then(res => console.log(res.data))
.catch(err => console.error(err));

// PUT
const formDataPut = new FormData();
formDataPut.append("titulo", "Nuevo título");
formDataPut.append("descripcion", "Nueva descripción");
formDataPut.append("foto_programa", archivoInput.files[0]);

axios.put(`http://localhost:8000/api/programas/prog_forma/put_delete/${id}`, formDataPut, {
  headers: { "Content-Type": "multipart/form-data" }
})
.then(res => console.log(res.data));


//delete
axios.delete(`http://localhost:8000/api/programas/prog_forma/put_delete/${id}`)
  .then(res => console.log(res.data));



//prueba
axios.get("http://localhost:8000/api/programas/prog_forma/get_post")
  .then(res => {
    alert("✅ ¡El frontend está conectado al backend!");
    console.log(res.data.data);  // Asegúrate de tener la consola del navegador abierta (F12)
  })
  .catch(err => {
    alert("❌ Error en la conexión. Revisa si el backend está corriendo y si la URL es correcta.");
    console.error(err);
  });


//correo
let formData = new FormData();
formData.append("titulo", "Taller de pintura");
formData.append("descripcion", "Un espacio para aprender técnicas de acuarela.");
formData.append("foto_programa", fileInput.files[0]); 
formData.append("correo", "persona@email.com"); // 👈 destinatario
