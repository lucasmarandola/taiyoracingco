         var mymap = L.map('map').setView([-34.6037, -58.3816], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(mymap);

        var currentDate = moment().format("YYYY-MM-DD");

        // Llamamos a la función loadEventsFromCSV y le pasamos la URL del archivo CSV
        loadEventsFromCSV('https://taiyoracingcompany.neocities.org/events/event.csv');

        // Definimos la función loadEventsFromCSV
        function loadEventsFromCSV(csvUrl) {
          Papa.parse(csvUrl, {
            download: true,
            header: true,
            complete: function(results) {
              var events = results.data.map(function(event) {
                var location_x = parseFloat(event.location_x);
                var location_y = parseFloat(event.location_y);

                // Verificar que los valores sean numéricos
                if (isNaN(location_x) || isNaN(location_y)) {
                  return null;
                }

                return {
                  title: event.title,
                  description: event.description,
                  location: [location_x, location_y],
                  date: event.date,
                  address: event.address,
                  instagram: event.instagram,
                  logo: event.logo,
                  category: event.category
                };
              }).filter(function(event) {
                return event !== null;
              });
              
              events = events.filter(function(event) {
                return moment(event.date, "YYYY-MM-DD").isAfter(currentDate);
              });
              
              addMarkers(events);
            }
          });
        }
        
        // Definimos la función addMarkers
        function addMarkers(events) {
          events.forEach(function(event) {
            var marker = L.marker(event.location).addTo(mymap);
            marker.bindPopup(`
              <div>
                <img src="${event.logo}" alt="${event.title}">
                <p><small>${event.category}</small></p>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p><b>${event.date}</b></p>
                <p>${event.address}</p>
                <div class="back-to-top-container">
                  <a href="${event.instagram}">INSTAGRAM</a>
                  <a href="#" onclick="addToGoogleCalendar('${event.title}', '${event.date}', '${event.address}')">Añadir a Google Calendar</a>
                </div>
              </div>
            `);
          });
        }
        
        // Definimos la función addToGoogleCalendar
        function addToGoogleCalendar(title, date, address) {
          // Formatear la fecha utilizando Moment.js
          var formattedDate = moment(date, "YYYY-MM-DD").format("YYYYMMDD");

          // Construir la URL de Google Calendar
          var googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedDate}/${formattedDate}&location=${encodeURIComponent(address)}`;
          window.open(googleCalendarUrl, "_blank");
        }