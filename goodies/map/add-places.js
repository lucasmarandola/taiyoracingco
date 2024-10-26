var allMarkers = [];
var meetLayer = L.layerGroup();
var museumLayer = L.layerGroup();
var memphisLayer = L.layerGroup();
var eventLayer = L.layerGroup();
var esteticaLayer = L.layerGroup();
var chapaLayer = L.layerGroup();
var tallerLayer = L.layerGroup();
var graficaLayer = L.layerGroup();
var raceLayer = L.layerGroup();
var otherLayer = L.layerGroup();
var events = [];

var map = L.map('map').setView([-34.61315, -58.37723], 5); 

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

var currentDate = moment().format("YYYY-MM-DD");
function openDirections(latitude, longitude, address) {
  var googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  window.open(googleMapsUrl, '_blank');
  document.getElementById('calendarClickSound').play();
}
function addToGoogleCalendar(title, date, address) {
var formattedDate = moment(date, "YYYY-MM-DD").format("YYYYMMDD");
var googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedDate}/${formattedDate}&location=${encodeURIComponent(address)}`;

window.open(googleCalendarUrl, "_blank");
document.getElementById('calendarClickSound').play();
}

var markersMap = new Map();

// Load events from CSV
loadEventsFromCSV('https://lucasmarandola.github.io/taiyoracingco/goodies/map/event.csv');

// Load places from CSV
loadPlacesFromCSV('https://lucasmarandola.github.io/taiyoracingco/goodies/map/place.csv');

function loadEventsFromCSV(csvUrl) {
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results) {
      events = results.data.map(function(event) {
        var location_x = parseFloat(event.location_x);
        var location_y = parseFloat(event.location_y);

        // Check if location values are numeric
        if (isNaN(location_x) || isNaN(location_y)) {
          return null;
        }

        return {
          title: event.title,
          description: event.description,
          location: [location_x, location_y],
          date: moment.utc(event.date).local().format("YYYY-MM-DD"),
          address: event.address,
          instagram: event.instagram,
          logo: event.logo,
          category: event.category,
          flyer_link: event.flyer_link,
          source: 'csv' // Indicate that this event comes from the CSV file
        };
      }).filter(function(event) {
        return event !== null;
      });
      
      // Filter only future events
      events = events.filter(function(event) {
        return moment(event.date, "YYYY-MM-DD").isSameOrAfter(moment().startOf('day'));
      });

      console.log('Loaded Events:', events); // Debugging step to check the loaded events

      addMarkers(events);
      fillEventList(events); // Fill the event list after loading events
      populateEventNamesFilter(events); // Populate the event names filter after loading events
    }
  });
}

function populateEventNamesFilter(events) {
  var eventNameFilter = document.getElementById('event-name-filter');
  
  if (!eventNameFilter) {
    console.error("Event Name Filter not found!"); // Debugging step to ensure the element exists
    return;
  }

  // Filtrar los eventos por categoría "RACE" y extraer los nombres únicos
  var uniqueRaceEventNames = [...new Set(events.filter(function(event) {
    return event.category === "RACE"; // Filtrar solo los eventos de la categoría "RACE"
  }).map(function(event) {
    return event.title;
  }))].sort(); // Ordenar alfabéticamente

  console.log('Unique Race Event Names:', uniqueRaceEventNames); // Debugging step to check unique event names

  // Añadir las opciones al filtro
  eventNameFilter.innerHTML = '<option value="ALL">Todos los eventos</option>'; // Opción por defecto para mostrar todos los eventos
  uniqueRaceEventNames.forEach(function(name) {
    var option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    eventNameFilter.appendChild(option);
  });
}



function loadPlacesFromCSV(csvUrl) {
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results) {
      var places = results.data.map(function(place) {
        var location_x = parseFloat(place.location_x);
        var location_y = parseFloat(place.location_y);

        // Check if location values are numeric
        if (isNaN(location_x) || isNaN(location_y)) {
          return null;
        }

        return {
          title: place.title,
          description: place.description,
          location: [location_x, location_y],
          address: place.address,
          instagram: place.instagram,
          logo: place.logo,
          category: place.category,
          flyer_link: place.flyer_link,
          source: 'csv' // Indicate that this place comes from the CSV file
        };
      }).filter(function(place) {
        return place !== null;
      });
      
      addMarkers(places);
      fillPlaceList(places); // Fill the place list after loading places
    }
  });
}

function addMarkers(data) {
  data.forEach(function (item) {
    var markerIcon;

    // Set marker icon based on the item's category
    if (item.category === "MEET") {
      markerIcon = L.icon({
        iconUrl: 'https://lucasmarandola.github.io/taiyoracingco/goodies/map/pins/pin_meet.png',
        iconSize: [32, 46],
      });
      meetLayer.addLayer(createMarker(item, markerIcon));
    } else if (item.category === "MUSEUM") {
      markerIcon = L.icon({
        iconUrl: 'https://lucasmarandola.github.io/taiyoracingco/goodies/events/pin_museum.png',
        iconSize: [32, 46],
      });
      museumLayer.addLayer(createMarker(item, markerIcon));
    } else if (item.category === "RACE") {
      markerIcon = L.icon({
        iconUrl: 'https://lucasmarandola.github.io/taiyoracingco/goodies/map/pins/pin_carrera.png',
        iconSize: [32, 46],
      });
      raceLayer.addLayer(createMarker(item, markerIcon));
    } else if (item.category === "EVENT") {
      markerIcon = L.icon({
        iconUrl: 'https://lucasmarandola.github.io/taiyoracingco/goodies/map/pins/pin_event.png',
        iconSize: [32, 46],
      });
      eventLayer.addLayer(createMarker(item, markerIcon));
    } else if (item.category === "Estética Vehicular") {
      markerIcon = L.icon({
        iconUrl: 'https://lucasmarandola.github.io/taiyoracingco/goodies/map/pins/pin_detail.png',
        iconSize: [32, 46],
      });
      esteticaLayer.addLayer(createMarker(item, markerIcon));
    } else if (item.category === "Chapa y pintura") {
      markerIcon = L.icon({
        iconUrl: 'https://lucasmarandola.github.io/taiyoracingco/goodies/map/pins/pin_paint.png',
        iconSize: [32, 46],
      });
      chapaLayer.addLayer(createMarker(item, markerIcon));
    } else if (item.category === "Taller de carrocería") {
      markerIcon = L.icon({
        iconUrl: 'https://lucasmarandola.github.io/taiyoracingco/goodies/map/pins/pin_bodyshop.png',
        iconSize: [32, 46],
      });
      tallerLayer.addLayer(createMarker(item, markerIcon));
    } else if (item.category === "Gráfica Vehicular") {
      markerIcon = L.icon({
        iconUrl: 'https://lucasmarandola.github.io/taiyoracingco/goodies/map/pins/pin_grafica.png',
        iconSize: [32, 46],
      });
      graficaLayer.addLayer(createMarker(item, markerIcon));
    } else if (item.category === "OTHER") {
      markerIcon = L.icon({
        iconUrl: 'https://lucasmarandola.github.io/taiyoracingco/goodies/map/pins/pin_other.png', // Asegúrate de tener un ícono para esta categoría
        iconSize: [32, 46],
      });
      otherLayer.addLayer(createMarker(item, markerIcon)); // Podés crear un nuevo Layer o usar uno existente
    }
  });
}


    

    function createMarker(item, markerIcon) {
  var marker = L.marker(item.location, { icon: markerIcon });
  
  var popupContent = `
<div style="font-family: 'Swis721', sans-serif; max-width: 350px;"> <!-- Adjust max-width as needed -->
  <div class="custom-popup" style="display: flex; flex-wrap: wrap; margin-left: 0px;"> 
    <div style="flex: 1; padding-right: 0px;">
      <img src="${item.logo}" alt="Logo" style="width: 90px; height: 90px;">
    </div>

    <div style="flex: 2;">
      <div class="popup-title" style="margin-bottom: 5px; line-height: 1;">
        <h3 style="font-family: 'Swis721B', sans-serif; font-size: 20px; margin-bottom: 3px; margin-top: 0px;">${item.title}</h3>
        <p style="margin-bottom: 5px; margin-top: 8px;"><strong>${item.category}</strong></p>
        ${typeof item.date !== 'undefined' ? `<p style="margin-bottom: 5px; margin-top: 8px; "><strong>${item.date}</strong></p>` : ''}

        <p style="margin-bottom: 5px; margin-top: 8px;"><img src="https://lucasmarandola.github.io/taiyoracingco/goodies/events/pin.svg" alt="Location Pin Icon" style="width: 10px; height: 10px; margin-right: 5px;">${item.address}</p>
      </div>
    </div>
    <!-- First separator -->
    <hr style="width: 100%; margin-top: 10px; margin-bottom: 10px; border: none; border-top: 1px solid #ccc;">
    <!-- Description -->
    <div style="flex-basis: 100%;">
      <p style="font-family: 'Swis721', sans-serif; margin-bottom: 0px; margin-top: 0px;">${item.description}</p>
    </div>
    <!-- Second separator -->
    <hr style="width: 100%; margin-top: 10px; margin-bottom: 10px; border: none; border-top: 1px solid #ccc;">

    <div style="flex-basis: 100%; display: flex; justify-content: space-between; margin-bottom: -5px;">
      <button class="popup-button" onclick="window.open('${item.instagram}', '_blank')" onmouseover="playHoverSound()">
        <div style="display: flex; align-items: center;">
          <img src="https://lucasmarandola.github.io/taiyoracingco/goodies/map/assets/butt_ig.png" alt="Instagram Icon" style="width: 20px; height: 20px; margin-right: 2.5px;">
          <span style="vertical-align: middle;">Instagram</span>
        </div>
      </button>
      
      <button class="popup-button" onclick="addToGoogleCalendar('${item.title}', '${item.date}', '${item.address}')" onmouseover="playHoverSound()" ${item.date === 'NONE' || typeof item.date === 'undefined' ? 'disabled' : ''} style="${item.date === 'NONE' || typeof item.date === 'undefined' ? 'opacity: 0.3; background-color: white; border: 1px solid black; color: black;' : ''}">
        <div style="display: flex; align-items: center;">
          ${item.date !== 'NONE' && typeof item.date !== 'undefined' ? '<img src="https://lucasmarandola.github.io/taiyoracingco/goodies/map/assets/butt_calendar.png" alt="Calendar Icon" style="width: 20px; height: 20px; margin-right: 2.5px;">' : ''}
          <span style="vertical-align: middle;">${item.date === 'NONE' || typeof item.date === 'undefined' ? 'Fecha no disponible' : 'Añadir a calendario'}</span>
        </div>
      </button>
        
      <button class="popup-button" onclick="openDirections('${item.location[0]}', '${item.location[1]}', '${item.address}')">
        <div style="display: flex; align-items: center;">
          <img src="https://lucasmarandola.github.io/taiyoracingco/goodies/map/assets/butt_route.png" alt="Directions Icon" style="width: 20px; height: 20px; margin-right: 2.5px;">
          <span style="vertical-align: middle;">Direcciones</span>
        </div>
      </button>
    </div>

    <button class="popup-button" onclick="${item.flyer_link !== 'NONE' ? `window.open('${item.flyer_link}', '_blank')` : ''}" style="margin-top: 5px; ${item.flyer_link === 'NONE' ? 'opacity: 0.3; background-color: white; border: 1px solid black;' : ''}">
      <div style="display: flex; align-items: center; justify-content: center; width: 286px; height: 15px;">
        <span style="vertical-align: middle; text-align: center; color: ${item.flyer_link === 'NONE' ? 'black' : 'inherit'};">${item.flyer_link !== 'NONE' ? 'Descargar flyers del lugar' : 'Flyer no disponible.'}</span>
      </div>
    </button>

  </div>    
  </div>
</div>
`;

   marker.bindPopup(popupContent);
  markersMap.set(item.title, marker);
  return marker;
}

// Add layers to the map
otherLayer.addTo(map);
meetLayer.addTo(map);
eventLayer.addTo(map);
raceLayer.addTo(map);
museumLayer.addTo(map);
esteticaLayer.addTo(map);
chapaLayer.addTo(map);
tallerLayer.addTo(map);
graficaLayer.addTo(map);

// Add layer control
var baseLayers = {
  "Meet": meetLayer,
  "Evento - Participar": eventLayer,
  "Evento - Espectador": raceLayer,
  "Otros eventos": otherLayer,
  "Museo": museumLayer,
  "Estética Vehicular": esteticaLayer,
  "Chapa y pintura": chapaLayer,
  "Taller de carrocería": tallerLayer,
  "Gráfica Vehicular": graficaLayer
};

L.control.layers(null, baseLayers).addTo(map);

function fillEventList(events) {
  // Ordenar los eventos por fecha
  events.sort(function(a, b) {
    return moment(a.date, "YYYY-MM-DD").diff(moment(b.date, "YYYY-MM-DD"));
  });

  var eventListItems = document.getElementById('event-list-items');
  eventListItems.innerHTML = '';

  events.forEach(function(event) {
    var listItem = document.createElement('li');
    var eventLink = document.createElement('span'); // Cambiado de <a> a <span>
    var formattedDate = moment(event.date, "YYYY-MM-DD").locale('es').format("DD/MM/YYYY");

    // Cambiar la etiqueta href por un atributo personalizado para almacenar la ubicación del evento
    eventLink.setAttribute('data-location', event.location.join(',')); 

    eventLink.style.cursor = 'pointer'; // Cambiar el cursor para indicar que es clickable
    eventLink.style.fontFamily = "'Swis721', sans-serif"; // Establecer la fuente para el enlace
    eventLink.style.color = "inherit"; // Heredar el color del texto del contenedor
    eventLink.style.textDecoration = "none"; // Quitar la subrayado del enlace

    // Crear un contenedor para la imagen y el texto
    var eventContent = document.createElement('div');
    eventContent.style.display = 'flex';
    eventContent.style.alignItems = 'center';

    // Si el logo del evento existe, agregar la imagen
    if (event.logo && event.logo !== 'NONE') {
      var eventImage = document.createElement('img');
      eventImage.src = event.logo;
      eventImage.style.width = '30px';
      eventImage.style.height = '30px';
      eventImage.style.marginRight = '10px'; // Espacio entre la imagen y el texto
      eventContent.appendChild(eventImage);
    }

    // Establecer el contenido del enlace con la fecha y el título
    eventLink.innerHTML = `<span style="font-family: 'Swis721B', sans-serif;">${formattedDate}</span> - <span style="font-family: 'Swis721', sans-serif;">${event.title}</span>`;
    eventLink.setAttribute('data-title', event.title);

    // Agregar un controlador de eventos para el clic en el span que mueva el mapa a la ubicación del evento
    eventLink.addEventListener('click', function() {
      var location = eventLink.getAttribute('data-location').split(',').map(parseFloat);
      var title = eventLink.getAttribute('data-title'); // Obtener el título para buscar el marcador
      var marker = markersMap.get(title);
      
      if (marker) {
          map.closePopup(); // Cerrar cualquier popup abierto
          map.panTo(location); // Mover el mapa a la ubicación del marcador
          marker.openPopup(); // Abrir el popup del marcador
          playListButtonClickSound(); // Reproducir sonido
      }
    });

    eventContent.appendChild(eventLink);
    listItem.appendChild(eventContent);
    eventListItems.appendChild(listItem);
  });
}


function filterEventsByName() {
  var selectedName = document.getElementById('event-name-filter').value;

  // Limpiar los layers de eventos previos
  meetLayer.clearLayers();
  eventLayer.clearLayers();
  raceLayer.clearLayers();

  // Filtrar los eventos según el nombre seleccionado
  var filteredEvents = events.filter(function(event) {
    return selectedName === 'ALL' || event.title === selectedName;
  });

  console.log('Filtered Events:', filteredEvents); // Debugging step to check filtered events

  // Agregar marcadores de los eventos filtrados
  addMarkers(filteredEvents);
  fillEventList(filteredEvents);
}

function filterEvents() {
  var selectedCategory = document.getElementById('event-filter').value;

  // Limpiar los layers de eventos previos
  meetLayer.clearLayers();
  eventLayer.clearLayers();
  raceLayer.clearLayers();

  // Filtrar los eventos según la categoría seleccionada
  var filteredEvents = events.filter(function(event) {
    if (selectedCategory === 'ALL') {
      return true; // Mostrar todos los eventos
    } else {
      return event.category === selectedCategory; // Filtrar según la categoría
    }
  });

  // Agregar marcadores de los eventos filtrados
  addMarkers(filteredEvents);

  // Actualizar la lista de eventos
  fillEventList(filteredEvents);
}


