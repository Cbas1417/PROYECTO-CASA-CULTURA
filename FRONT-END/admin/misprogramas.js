
    document.addEventListener('DOMContentLoaded', function() {
      // Simular carga de datos
      setTimeout(cargarInscripciones, 800);
      
      // Configurar búsqueda
      document.getElementById('buscar-inscripcion').addEventListener('input', function(e) {
        buscarInscripciones(e.target.value);
      });
    });

    function cargarInscripciones() {
      const inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
      const cuerpoTabla = document.getElementById('inscripciones-body');
      
      // Actualizar contador
      document.getElementById('contador-resultados').textContent = 
        `${inscripciones.length} inscripción${inscripciones.length !== 1 ? 'es' : ''}`;
      
      if (inscripciones.length === 0) {
        cuerpoTabla.innerHTML = `
          <tr>
            <td colspan="4">
              <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No hay inscripciones registradas</h3>
                <p>Cuando los usuarios se inscriban a programas, aparecerán listados aquí.</p>
              </div>
            </td>
          </tr>`;
      } else {
        cuerpoTabla.innerHTML = inscripciones.map(insc => `
          <tr>
            <td class="programa-cell">${insc.programaNombre}</td>
            <td class="contacto-cell">${insc.contacto}</td>
            <td class="fecha-cell">${insc.fecha}</td>
            <td>
              <button class="btn-eliminar" onclick="eliminarInscripcion(${insc.id})">
                <i class="fas fa-trash-alt"></i> Eliminar
              </button>
            </td>
          </tr>
        `).join('');
      }
    }

    function buscarInscripciones(termino) {
      const inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
      const cuerpoTabla = document.getElementById('inscripciones-body');
      const term = termino.toLowerCase();
      
      if (termino === '') {
        cargarInscripciones();
        return;
      }
      
      const resultados = inscripciones.filter(insc => 
        insc.programaNombre.toLowerCase().includes(term) || 
        insc.contacto.toLowerCase().includes(term) ||
        insc.fecha.toLowerCase().includes(term)
      );
      
      // Actualizar contador
      document.getElementById('contador-resultados').textContent = 
        `${resultados.length} inscripción${resultados.length !== 1 ? 'es' : ''} encontrada${resultados.length !== 1 ? 's' : ''}`;
      
      if (resultados.length === 0) {
        cuerpoTabla.innerHTML = `
          <tr>
            <td colspan="4">
              <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No se encontraron resultados</h3>
                <p>Intenta con otros términos de búsqueda.</p>
              </div>
            </td>
          </tr>`;
      } else {
        cuerpoTabla.innerHTML = resultados.map(insc => `
          <tr>
            <td class="programa-cell">${resaltarCoincidencia(insc.programaNombre, termino)}</td>
            <td class="contacto-cell">${resaltarCoincidencia(insc.contacto, termino)}</td>
            <td class="fecha-cell">${insc.fecha}</td>
            <td>
              <button class="btn-eliminar" onclick="eliminarInscripcion(${insc.id})">
                <i class="fas fa-trash-alt"></i> Eliminar
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
    
    function resaltarCoincidencia(texto, termino) {
      if (!termino) return texto;
      
      const regex = new RegExp(`(${termino})`, 'gi');
      return texto.replace(regex, '<span style="background-color: #fff3cd; padding: 2px 4px; border-radius: 4px;">$1</span>');
    }

    function eliminarInscripcion(id) {
      if (confirm("¿Estás seguro de que deseas eliminar esta inscripción?")) {
        // Mostrar animación de eliminación
        const btn = event.target;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
        btn.disabled = true;
        
        setTimeout(() => {
          let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
          inscripciones = inscripciones.filter(insc => insc.id !== id);
          localStorage.setItem('inscripciones', JSON.stringify(inscripciones));
          
          // Mostrar mensaje de éxito
          mostrarMensaje('Inscripción eliminada correctamente', 'success');
          
          // Recargar la tabla
          cargarInscripciones();
        }, 800);
      }
    }
    
    function mostrarMensaje(mensaje, tipo) {
      // Crear elemento de mensaje
      const mensajeEl = document.createElement('div');
      mensajeEl.textContent = mensaje;
      mensajeEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
      `;
      
      if (tipo === 'success') {
        mensajeEl.style.backgroundColor = '#28a745';
      } else {
        mensajeEl.style.backgroundColor = '#dc3545';
      }
      
      document.body.appendChild(mensajeEl);
      
      // Eliminar mensaje después de 3 segundos
      setTimeout(() => {
        mensajeEl.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          document.body.removeChild(mensajeEl);
        }, 300);
      }, 3000);
    }

    /*menu adaptable */
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
      });
    }

    // SIMULACIÓN DE SESIÓN ACTIVA
    const usuarioAutenticado = true; // ponlo en false si quieres probar sin sesión

    document.addEventListener("DOMContentLoaded", () => {
      const perfilDropdown = document.getElementById("perfil-icono");

      if (usuarioAutenticado) {
        perfilDropdown.style.display = "inline-block"; // 👈 se muestra el menú
      } else {
        perfilDropdown.style.display = "none";
      }

      // Mostrar/ocultar el menú con clic
      const perfilImg = document.getElementById("perfil-img");
      const dropdownMenu = document.getElementById("dropdown-menu");

      if (perfilImg) {
        perfilImg.addEventListener("click", (e) => {
          e.stopPropagation();
          dropdownMenu.classList.toggle("hidden");
        });

        document.addEventListener("click", (e) => {
          if (!perfilImg.contains(e.target)) {
            dropdownMenu.classList.add("hidden");
          }
        });
      }
    });

