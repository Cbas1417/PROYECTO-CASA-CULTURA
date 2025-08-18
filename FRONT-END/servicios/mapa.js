// 👉 PRIMERO declaramos los marcadores
const marcadores = [
  {
    lat: 6.0918804,
    lng: -75.6357673,
    titulo: 'Monumento Ciro Mendía',
    descripcion: 'Ciro Mendía —cuyo nombre real fue Carlos Edmundo Mejía Ángel— fue un destacado poeta y dramaturgo nacido en Caldas en 1892. Se le reconoce como el iniciador del teatro regionalista colombiano, y sus obras tuvieron un gran impacto en la escena cultural, logrando llenos históricos en Medellín',
    imagen: '../imagenes/ciro.jpg'
  },
  {
    lat: 6.0925,
    lng: -75.6360,
    titulo: 'Parque Principal',
    descripcion: 'El Parque Principal de Caldas, también conocido como Parque Santander o Parque Caldas, es el corazón social del municipio, construido en 1892 bajo la influencia del intendente Jorge Herrán. Este espacio público histórico combina áreas verdes, un quiosco central, y monumentos importantes como la estatua de Francisco José de Caldas, la Fuente de los Amantes y la Catedral cercana. ',
    imagen: '../imagenes/Parque_de_Caldas.jpg'
  },
  {
    lat: 6.0908,
    lng: -75.6352,
    titulo: 'Iglesia Central',
    descripcion: 'La Catedral Nuestra Señora de las Mercedes, estilo neoclásico, es uno de los mayores atractivos arquitectónicos del municipio. Construida entre 1793 y 1804 por Roque Mejía —fundador de Caldas—, fue elevada a categoría de catedral en 1988 cuando se creó la diócesis local. Su interior destaca por su diseño en tres naves longitudinales, vitrales coloridos y obras de arte religioso. En su santuario, el marco del Señor de las Mercedes, tallado en madera, es una joya arquitectónica venerada por la comunidad. Diversos visitantes resaltan su conservación, belleza y valor como centro espiritual del sur del Valle de Aburrá',
    imagen: '../imagenes/iglesia.jpeg'
  }
];

// 👉 AHORA sí inicializamos el mapa
let map = L.map('map').setView([6.09106, -75.63569], 14);

// Capa base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Crear los marcadores en el mapa
marcadores.forEach(({lat, lng, titulo, descripcion, imagen}) => {
  let marker = L.marker([lat, lng]).addTo(map);

  marker.bindPopup(`<b>${titulo}</b>`);
  marker.bindTooltip(titulo, {sticky: true});

  marker.on('click', () => {
    openModal(titulo, descripcion, imagen);
  });
});


// Evento para el select-location: mover mapa, hacer zoom 19 y abrir popup del marcador
document.getElementById('select-location').addEventListener('change', function(e) {
  let coords = e.target.value.split(",");
  let lat = parseFloat(coords[0]);
  let lng = parseFloat(coords[1]);
  map.flyTo([lat, lng], 18);

  // Abrir popup del marcador correspondiente y cerrar otros
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      if (layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
        layer.openPopup();
      } else {
        layer.closePopup();
      }
    }
  });
});

/*menu adaptable */
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});


//logueo
// Menú de usuario (ver perfil / cerrar sesión)
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

    document.addEventListener("click", () => {
      dropdownMenu.classList.add("hidden");
    });
  }

  if (cerrarSesion) {
    cerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "mapa.html";
    });
  }

  if (btnRegistrar) {
    btnRegistrar.addEventListener("click", () => {
      sessionStorage.setItem("paginaAnterior", window.location.href);
    });
  }
});

function openModal(title, description, image) {
  const modal = document.getElementById("infoModal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalImage = document.getElementById("modal-image");
  
  // Colocar los datos en el modal
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  
  // Imagen
  if (image && image !== '') {
    modalImage.src = image;
    modalImage.style.display = "block";
    modalImage.alt = title;
  } else {
    modalImage.style.display = "none";
    modalImage.src = '';
  }
  
  // Mostrar modal
  modal.style.display = "block";
  
  // Asegurarse de que el modal esté en la parte superior
  modal.scrollTo(0, 0);
}

// Cerrar modal
document.querySelector(".close-btn").onclick = function() {
    document.getElementById("infoModal").style.display = "none";
};

// Cerrar modal si clickea afuera
window.onclick = function(event) {
    let modal = document.getElementById("infoModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


//parte del modal
//buscador
// Array con los datos de búsqueda (debe coincidir con tus marcadores)
const lugaresParaBuscar = [
  {
    nombre: "Monumento Ciro Mendía",
    descripcion: "Monumento al poeta y dramaturgo Ciro Mendía en Caldas",
    coordenadas: [6.0918804, -75.6357673]
  },
  {
    nombre: "Parque Principal",
    descripcion: "Parque principal del municipio de Caldas",
    coordenadas: [6.0925, -75.6360]
  },
  {
    nombre: "Iglesia Central",
    descripcion: "Catedral Nuestra Señora de las Mercedes en Caldas",
    coordenadas: [6.0908, -75.6352]
  }
  // Agrega aquí todos tus lugares/marcadores
];

// Elementos del DOM
const buscadorInput = document.getElementById('buscador-input');
const buscadorResultados = document.getElementById('buscador-resultados');

// Función para filtrar resultados
function filtrarResultados(termino) {
  buscadorResultados.innerHTML = '';
  
  if (!termino) return;
  
  const terminoLower = termino.toLowerCase();
  const resultados = lugaresParaBuscar.filter(lugar => 
    lugar.nombre.toLowerCase().includes(terminoLower) || 
    lugar.descripcion.toLowerCase().includes(terminoLower)
  );
  
  mostrarResultados(resultados);
}

// Función para mostrar resultados
function mostrarResultados(resultados) {
  buscadorResultados.innerHTML = '';
  
  if (resultados.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No se encontraron resultados';
    buscadorResultados.appendChild(li);
    return;
  }
  
  resultados.forEach(lugar => {
    const li = document.createElement('li');
    li.textContent = lugar.nombre;

    li.addEventListener('click', () => {
  map.flyTo(lugar.coordenadas, 18);
  
  // Abrir el popup del marcador correspondiente
  marcadoresMapa.forEach(marker => {
    const latLng = marker.getLatLng();
    if (latLng.lat === lugar.coordenadas[0] && latLng.lng === lugar.coordenadas[1]) {
      marker.openPopup();
    }
  });
  
  buscadorInput.value = '';
  buscadorResultados.innerHTML = '';
});
    
    li.addEventListener('click', () => {
      // Centrar el mapa en las coordenadas del lugar
      map.flyTo(lugar.coordenadas, 18);
      
      // Opcional: Cerrar el buscador después de seleccionar
      buscadorInput.value = '';
      buscadorResultados.innerHTML = '';
    });
    
    buscadorResultados.appendChild(li);
  });
}

// Event listeners
buscadorInput.addEventListener('input', (e) => {
  filtrarResultados(e.target.value);
});

// Opcional: Buscar al presionar Enter
buscadorInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    filtrarResultados(e.target.value);
  }
});

// Opcional: Cerrar resultados al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('#buscador-lateral')) {
    buscadorResultados.innerHTML = '';
  }
});