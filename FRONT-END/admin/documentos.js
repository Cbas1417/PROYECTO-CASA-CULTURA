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
          <button onclick="mostrarEliminar(${index})">🗑️</button>
        `;

        tabla.appendChild(fila);
      });
  }

  window.mostrarEliminar = (index) => {
    indexEliminar = index;
    modalTexto.textContent = `¿Eliminar a ${usuarios[index].nombre}?`;
    modal.classList.add("visible");
  };

  btnCancelar.addEventListener("click", () => {
    modal.classList.remove("visible");
    indexEliminar = null;
  });

  btnConfirmar.addEventListener("click", () => {
    if (indexEliminar !== null) {
      usuarios.splice(indexEliminar, 1);
      renderizarUsuarios();
      modal.classList.remove("visible");
      indexEliminar = null;
    }
  });

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

  buscador.addEventListener("input", renderizarUsuarios);

  renderizarUsuarios();
});


/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}