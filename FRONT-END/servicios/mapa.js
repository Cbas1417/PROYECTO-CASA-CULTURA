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
    lat: 6.0918552,
    lng: -75.6356749629274,
    titulo: 'Parque Santander',
    descripcion: 'El Parque Principal de Caldas, también conocido como Parque Santander o Parque Caldas, es el corazón social del municipio, construido en 1892 bajo la influencia del intendente Jorge Herrán. Este espacio público histórico combina áreas verdes, un quiosco central, y monumentos importantes como la estatua de Francisco José de Caldas, la Fuente de los Amantes y la Catedral cercana. ',
    imagen: '../imagenes/Parque_de_Caldas.jpg'
  },
  {
    lat: 6.09175626994346,
    lng: -75.63632013801823,
    titulo: 'Catedral nuestra señora de las mercedes',
    descripcion: 'La Catedral Nuestra Señora de las Mercedes, estilo neoclásico, es uno de los mayores atractivos arquitectónicos del municipio. Construida entre 1793 y 1804 por Roque Mejía —fundador de Caldas—, fue elevada a categoría de catedral en 1988 cuando se creó la diócesis local. Su interior destaca por su diseño en tres naves longitudinales, vitrales coloridos y obras de arte religioso. En su santuario, el marco del Señor de las Mercedes, tallado en madera, es una joya arquitectónica venerada por la comunidad. Diversos visitantes resaltan su conservación, belleza y valor como centro espiritual del sur del Valle de Aburrá',
    imagen: '../imagenes/iglesia.jpeg'
  },
  {
    lat: 6.092392158424545, 
    lng: -75.63517972608665 ,
    titulo: 'Casa municipal de la cultura',
    descripcion: 'Espacio cultural y arquitectónico en el centro del municipio',
    imagen: '../imagenes/Captura de pantalla 2025-05-16 154548.png'
  },
  {
    lat: 6.091515825175463, 
    lng: -75.63855421530697,
    titulo: 'Parque Olaya Herrera',
    descripcion: 'Construido hacia 1911, este parque fue inicialmente llamado Parque del Ferrocarril, por su cercanía a la antigua estación. En honor al expresidente Enrique Olaya Herrera adoptó su nombre actual. Ha sido espacio de encuentro comunitario, político y cultural. Alberga monumentos como el busto de Olaya Herrera y antiguamente un monumento a "La Pola". Reconocido como bien patrimonial por su valor histórico y arquitectónico.',
    imagen: '../imagenes/Olaya_herrera.jpeg'
  },
  {
    lat: 6.08936,
    lng: -75.63236,
    titulo: 'Estadio Luis Fernando Montoya',
    descripcion: 'El Estadio Luis Fernando Montoya es el estadio de fútbol del municipio de Caldas, con capacidad para ~6000 espectadores; inaugurado en junio de 2015. ',
    imagen: '../imagenes/estadio.jpg'
  },
  {
    lat: 6.03647185,
    lng: -75.5878048000717,
    titulo: 'Alto de San Miguel (vereda La Clara)',
    descripcion: 'El Alto de San Miguel, en la vereda La Clara de Caldas, reserva natural con altura ~2.100 metros sobre el nivel del mar, rica biodiversidad, senderismo, naturaleza, punto alto de referencia en el municipio.',
    imagen: '../imagenes/alto_san_miguel.jpg'
  },
  {
    lat: 6.0926315762171015,  // aproximado al centro urbano de Caldas
    lng: -75.63941388432814, 
    titulo: 'Museo de la Loza y la Cerámica Contemporánea',
    descripcion: 'Museo dedicado a la conservación, investigación, exhibición y divulgación del patrimonio material e inmaterial de la cultura cerámica del municipio; con exposición permanente de historia y diseño cerámico. ',
    imagen: '../imagenes/museo_ceramica.jpg'
  },
    {
    lat: 6.091395749490232,  // aproximado al centro urbano de Caldas
    lng: -75.6361238304638, 
    titulo: 'Calle del comercio',
    descripcion: 'La Calle del Comercio es una de las vías más tradicionales y representativas del municipio de Caldas. Desde finales del siglo XIX se consolidó como el principal corredor comercial del pueblo, donde artesanos, campesinos y comerciantes ofrecían sus productos a los viajeros que transitaban entre el sur del Valle de Aburrá y el suroeste antioqueño. Durante décadas fue el epicentro de la vida económica y social de la localidad, concentrando tiendas de víveres, ferreterías, droguerías y fondas que abastecían tanto a los habitantes como a los arrieros que recorrían la ruta. ',
    imagen: '../imagenes/Calle_comercio.jpg'
  },
    {
    lat: 6.096413307327509,  // aproximado al centro urbano de Caldas
    lng: -75.63457540419773, 
    titulo: 'Parque 3 aguas',
    descripcion: 'el Parque de las Tres Aguas se mantiene como un punto de recreación comunitaria con ludoteca, juegos infantiles, cancha de microfútbol y zonas verdes, siendo especialmente importante para los barrios La Inmaculada y Olaya Herrera. Más allá de su infraestructura, el parque es valorado como un símbolo ambiental, al recuperar y proteger un espacio en torno a las fuentes hídricas que han acompañado la historia del municipio. ',
    imagen: '../imagenes/Parque_3_aguas.jpg'
  },
    {
    lat: 6.091755731985458	,  // aproximado al centro urbano de Caldas
    lng: -75.6350218656795, 
    titulo: 'Casa consistoral (nuevo Cam)',
    descripcion: 'uno de los edificios más representativos del centro histórico del municipio. Ubicada en inmediaciones del Parque Principal, esta construcción ha sido, desde finales del siglo XIX, el lugar donde se han tomado las principales decisiones administrativas y políticas de la localidad. ',
    imagen: '../imagenes/Alcaldia.png'
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
// Crear los marcadores en el mapa
const marcadoresMapa = []; // guardar referencia a los markers

marcadores.forEach(({lat, lng, titulo, descripcion, imagen}) => {
  let marker = L.marker([lat, lng]).addTo(map);

  marker.bindPopup(`<b>${titulo}</b>`);
  marker.bindTooltip(titulo, {sticky: true});

  marker.on('click', () => {
    openModal(titulo, descripcion, imagen);
  });

  marcadoresMapa.push(marker); // guardar el marker para después
});

// 👉 LLENAR EL SELECT CON LOS MARCADORES
const select = document.getElementById('select-location');

// Primero opción por defecto
select.innerHTML = `<option value="">-- Selecciona un lugar --</option>`;

// Generar dinámicamente cada opción
marcadores.forEach(m => {
  const option = document.createElement("option");
  option.value = `${m.lat},${m.lng}`;
  option.textContent = m.titulo;
  select.appendChild(option);
});

// Evento para el select-location: mover mapa, hacer zoom 18 y abrir modal del marcador
select.addEventListener('change', function(e) {
  if (!e.target.value) return;

  let coords = e.target.value.split(",");
  let lat = parseFloat(coords[0]);
  let lng = parseFloat(coords[1]);
  map.flyTo([lat, lng], 18);

  // Buscar el marcador correspondiente y abrir modal después de 3s
  marcadores.forEach(m => {
    if (m.lat === lat && m.lng === lng) {
      setTimeout(() => {
        openModal(m.titulo, m.descripcion, m.imagen);
      }, 3000); // 3100 ms = 3 segundos
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
const lugaresParaBuscar =  [
  {
    nombre: "Monumento Ciro Mendía",
    descripcion: "Monumento al poeta y dramaturgo Ciro Mendía en Caldas",
    coordenadas: [6.0918804, -75.6357673]
  },
  {
    nombre: "Parque Santander",
    descripcion: "Parque Principal de Caldas, también conocido como Parque Santander",
    coordenadas: [6.0925, -75.6360]
  },
  {
    nombre: "Catedral nuestra señora de las mercedes",
    descripcion: "Catedral Nuestra Señora de las Mercedes en Caldas",
    coordenadas: [  6.09175626994346, -75.63632013801823]
  },
  {
    nombre: "Museo de la Cerámica",
    descripcion: "Museo de la Loza y la Cerámica Contemporánea de Caldas",
    coordenadas: [6.0926315762171015, -75.63941388432814,] // aproximado
  },
  {
    nombre: "Casa municipal de la Cultura",
    descripcion: "Espacio cultural y arquitectónico en el centro del municipio",
    coordenadas: [6.092392158424545, -75.63517972608665] // aproximado
  },
  {
    nombre: "Parque Olaya Herrera",
    descripcion: "Parque de la Locería, parte de la Ruta de la Cerámica en Caldas",
    coordenadas: [6.091515825175463, -    75.63855421530697] // aproximado
  },
  {
    nombre: "Estadio Luis Fernando Montoya",
    descripcion: "Estadio municipal inaugurado en 2015 con capacidad para 6000 espectadores",
    coordenadas: [6.08936, -75.63236]
  },
  {
    nombre: "Alto de San Miguel",
    descripcion: "Reserva natural ubicada en la vereda La Clara, a 2100 msnm",
    coordenadas: [6.03647185, -75.5878048]
  },
    {
    nombre: "Calle del comercio",
    descripcion: "Estadio municipal inaugurado en 2015 con capacidad para 6000 espectadores",
    coordenadas: [6.091395749490232,  -75.6361238304638]
  },
    {
    nombre: "Parque 3 Aguas",
    descripcion: "Estadio municipal inaugurado en 2015 con capacidad para 6000 espectadores",
    coordenadas: [6.096413307327509, -75.63457540419773]
  },  {
    nombre: "Casa consistoral (nuevo Cam",
    descripcion: "Estadio municipal inaugurado en 2015 con capacidad para 6000 espectadores",
    coordenadas: [6.091755731985458	, -75.6350218656795]
  }
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



// Botón para subir
const btnSubir = document.getElementById('btnSubir');
if (btnSubir) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            btnSubir.style.display = 'inline-block';
        } else {
            btnSubir.style.display = 'none';
        }
    });

    btnSubir.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}