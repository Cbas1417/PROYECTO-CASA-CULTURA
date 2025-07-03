0// Inicializar mapa centrado en Caldas, Antioquia
let map = L.map('map').setView([6.09106, -75.63569], 14);

// Agregar capa base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Datos de los marcadores con coordenadas, título y id de sección para scroll
const marcadores = [
  {lat: 6.0918804, lng: -75.6357673, titulo: 'Monumento Ciro Mendía', idSeccion: 'infoCiroMendia'},
  {lat: 6.0925, lng: -75.6360, titulo: 'Parque Principal', idSeccion: 'infoParquePrincipal'},
  {lat: 6.0908, lng: -75.6352, titulo: 'Iglesia Central', idSeccion: 'infoIglesiaCentral'}
];

// Crear marcadores, tooltips y popups
marcadores.forEach(({lat, lng, titulo, idSeccion}) => {
  let marker = L.marker([lat, lng]).addTo(map);

  // Popup con título
  marker.bindPopup(`<b>${titulo}</b>`);

  // Tooltip que se muestra en hover
  marker.bindTooltip(titulo, {sticky: true});

  // Controlar visibilidad del tooltip según popup
  marker.on('popupopen', () => marker.closeTooltip());
  marker.on('popupclose', () => marker.openTooltip());

  // Mostrar tooltip al pasar mouse
  marker.on('mouseover', () => {
    if (!marker.isPopupOpen()) marker.openTooltip();
  });

  // Ocultar tooltip al quitar mouse
  marker.on('mouseout', () => {
    if (!marker.isPopupOpen()) marker.closeTooltip();
  });

  // Al hacer click en marcador, hacer scroll a la sección informativa
  marker.on('click', () => {
    const seccion = document.getElementById(idSeccion);
    if (seccion) seccion.scrollIntoView({behavior: 'smooth'});
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
