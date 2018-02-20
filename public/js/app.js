function initMap() {
  var lima = {
    // latitud y longitud de la ciudad de lima
    lat: -12.026733806103568,
    lng: -76.98777915
  };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    // ubicando el centro del mapa respecto a la variable Lima
    center: lima
  });
  // definiendo el marcador
  var marker = new google.maps.Marker({
    // position define la posicion del marcador
    position: lima,
    map: map,
    // asignando imagen de bicileta como marcador

  });
  window.addEventListener('load', function(event) {
    // Trazando la ruta
    // obteniendo datos de los inputs
    var originPoint = document.getElementById('originPoint');
    var destinyPoint = document.getElementById('destinyPoint');

    // usando la librería Autocomplete para el autocompletado de los lugares
    new google.maps.places.Autocomplete(originPoint);
    new google.maps.places.Autocomplete(destinyPoint);

    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    // calculando la ruta
    function calcRoute(directionsService, directionsDisplay) {
      var directionsRequest = {
        origin: originPoint.value,
        destination: destinyPoint.value,
        // travelMode: 'BICYCLING' ----> Las indicaciones para llegar en bicicleta no estan disponibles para Perú
        // travelMode: 'DRIVING' ----> default
        travelMode: 'DRIVING'
      };
      directionsService.route(directionsRequest, function(result, status) {
        if (status === 'OK') {
        var distanceRoute = result.routes[0].legs[0].distance.value/1000;
        // var duracion = result.routes[0].legs[0].duration.text;
        var costo = (distanceRoute*2.00).toFixed(2);

        document.getElementById('showCost').innerHTML="";
        document.getElementById('showCost').innerHTML= '<strong>Precio Calculado para la ruta:</strong>  s/' + costo;
        directionsDisplay.setDirections(result);
        } else {
          alert('Algo ha salido mal');
        }
      });
      directionsDisplay.setMap(map);
      // ocultando marcador
      marker.setMap(null);
    };
    document.getElementById('btn').addEventListener('click', function(event) {
      calcRoute(directionsService, directionsDisplay);
    });
    document.getElementById('myPosition').addEventListener('click', function(event) {
      event.preventDefault();
      if (navigator.geolocation) {
        // obteniendo la posicion actual del usuario
        navigator.geolocation.getCurrentPosition(function(position) {
        // ubicando el marcador con la posición actual del usuario
          coordenadas = position.coords;
          marker = new google.maps.Marker({
            position: {
              lat: coordenadas.latitude,
              lng: coordenadas.longitude
            },
            map: map,
            // cambiando marcador default por imagen de bicicleta
            icon: 'assets/bicicleta.png'
          });
          map.setZoom(18);
          // ubicando el centro del mapa con la latitud y la longitud
          map.setCenter({
            lat: coordenadas.latitude,
            lng: coordenadas.longitude});
        }, function(error) {
          alert('Ocurrio un error inesperado');
        });
      }
    });
  });
}
