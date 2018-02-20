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
        for (var i = 0; i < data.prices.length; i++) {
          var name = data.prices[i].localized_display_name;
          var distance = data.prices[i].distance;
          var priceEstimate = (data.prices[i].high_estimate + data.prices[i].low_estimate)/2;
          var costo = ((distanceRoute/distance)*priceEstimate).toFixed(2)+' PEN';
          console.log(name + ':  ' + costo);

          var div = document.createElement('div');
          div.innerHTML = name + ': '+costo
          document.getElementById('showCost').appendChild(div);
        }
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
      var myUbication = '';
  function ubicacion() {
    if (navigator.geolocation) {
      function localizacion(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        console.log(lat + '' + lng);
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            myUbication = results[1].formatted_address;
            document.getElementById('originPoint').value = myUbication;
          } else {
            alert('ocurrio un error inesperado');
          }
        });
      };
      function error() {
        alert('ocurrio un error inesperado');
      }
      navigator.geolocation.getCurrentPosition(localizacion, error);
    }
  };
  ubicacion();

    });
  });
}
