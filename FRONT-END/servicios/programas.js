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
  baileurba:{
    titulo: "Baile Urbano",
    texto: "Aprende los bailes urbanos como el hip hop, break dance y muchos mas."
  },
  folclor:{
    titulo: "Folclor",
    texto: "Aprende los bailes y ritmos de diferentes culturas y países."
  },
  banda:{
    titulo: "Banda",
    texto: "Aprende a tocar instrumentos de viento y percusión con nuestra banda."
  },
  cuerdaan:{
    titulo: "Cuerdas andinas",
    texto: "Aprende a tocar instrumentos de cuerda como la quena, siku y muchos mas."
  },
  cuerdafro:{
    titulo: "Cuerdas frotadas",
    texto: "Aprende a tocar instrumentos de cuerda como la charango, bandola y muchos mas."
  },
  artes:{
    titulo: "Artes visuales",
    texto: "Aprende técnicas de pintura, dibujo, escultura y muchas más."
  }

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

//correo
let formData = new FormData();
formData.append("titulo", "Taller de pintura");
formData.append("descripcion", "Un espacio para aprender técnicas de acuarela.");
formData.append("foto_programa", fileInput.files[0]); 
formData.append("correo", "persona@email.com"); // 👈 destinatario

 //contectos y volver arriba
    const btnSubir = document.getElementById('btnSubir');

    // Mostrar/ocultar botón de subir al hacer scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        btnSubir.style.display = 'inline-block';
      } else {
        btnSubir.style.display = 'none';
      }
    });

    // Scroll arriba
    btnSubir.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });


//conexion
// ===============================
// 🔗 CONEXIÓN FRONTEND ↔ BACKEND
// ===============================

// Base URL del backend
const API_BASE = "http://localhost:8000/api/programas/prog_forma/";

// ✅ GET: traer todos los programas
function getProgramas() {
  axios.get(`${API_BASE}get_post/`)
    .then(res => {
      console.log("📥 Programas recibidos:", res.data);
      // aquí puedes renderizar en tu HTML los programas
    })
    .catch(err => {
      console.error("❌ Error al traer programas:", err);
      alert("Error al conectar con el servidor.");
    });
}

// ✅ POST: crear un nuevo programa
function createPrograma(titulo, descripcion, archivo, correo) {
  let formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("descripcion", descripcion);
  if (archivo) formData.append("foto_programa", archivo);
  formData.append("correo", correo);

  axios.post(`${API_BASE}get_post/`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(res => {
      console.log("📤 Programa creado:", res.data);
      alert("✅ Programa creado correctamente");
      getProgramas(); // refresca la lista
    })
    .catch(err => {
      console.error("❌ Error al crear programa:", err);
      alert("Error al crear el programa.");
    });
}

// ✅ PUT: actualizar un programa
function updatePrograma(id, titulo, descripcion, archivo) {
  let formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("descripcion", descripcion);
  if (archivo) formData.append("foto_programa", archivo);

  axios.put(`${API_BASE}put_delete/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(res => {
      console.log("✏️ Programa actualizado:", res.data);
      alert("✅ Programa actualizado correctamente");
      getProgramas();
    })
    .catch(err => {
      console.error("❌ Error al actualizar programa:", err);
      alert("Error al actualizar el programa.");
    });
}

// ✅ DELETE: eliminar un programa
function deletePrograma(id) {
  axios.delete(`${API_BASE}put_delete/${id}/`)
    .then(res => {
      console.log("🗑️ Programa eliminado:", res.data);
      alert("✅ Programa eliminado correctamente");
      getProgramas();
    })
    .catch(err => {
      console.error("❌ Error al eliminar programa:", err);
      alert("Error al eliminar el programa.");
    });
}

// 🚀 Prueba inicial para ver si hay conexión
getProgramas();
