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
      //     var arr =[];
      //
      //     function geocode() {
      //     var address = document.getElementById('destinyPoint').value;
      //     var geocoder = new google.maps.Geocoder();
      //     geocoder.geocode({
      //     'address': address,
      //     'partialmatch': true
      //   }, geocodeResult);
      //
      //   function geocodeResult(results, status) {
      //     if (status == 'OK' && results.length > 0) {
      //       var latDestiny = results[0].geometry.location.lat();
      //       var lngDestiny = results[0].geometry.location.lng();
      //       arr = [latDestiny,lngDestiny];
      //       return arr;
      //     } else {
      //       alert("Geocode was not successful for the following reason: " + status);
      //     }
      //   }
      // }
          // // geocode();
          // console.log(geocode());

        // var distanceRoute = result.routes[0].legs[0].distance.value/1000;
        // var duracion = result.routes[0].legs[0].duration.text;
        // var costo = (distanceRoute*2.00).toFixed(2);
        // for (var i = 0; i < data.prices.length; i++) {
        //   var name = data.prices[i].localized_display_name;
        //   var distance = data.prices[i].distance;
        //   var priceEstimate = (data.prices[i].high_estimate + data.prices[i].low_estimate)/2;
        //   var costo = ((distanceRoute/distance)*priceEstimate).toFixed(2)+' PEN';
        //   console.log(name + ':  ' + costo);
        //
        //   var div = document.createElement('div');
        //   div.innerHTML = name + ': '+costo
        //   document.getElementById('showCost').appendChild(div);
        // }
        var destinyLat = result.routes[0].bounds.f.b;
        var destinyLng = result.routes[0].bounds.b.f;
        var originLat = result.routes[0].bounds.f.f;
        var originLgn = result.routes[0].bounds.b.b;
        getNews(destinyLat,destinyLng,originLat,originLgn);

        function getNews(destinyLat,destinyLng,originLat,originLgn) {
          // instanciando el objeto XMLHttpRequest para el funcionamiento de ajax
          const priceRequest = new XMLHttpRequest();

          priceRequest.open('GET', 'https://cors-anywhere.herokuapp.com/https://api.uber.com/v1.2/estimates/price?server_token=G1QV-BUwGiR6iwzCCO8aGWqwSFsdFb0qF8NOcGxR&start_latitude=-12.122932&start_longitude=-77.014693&end_latitude=-12.160327&end_longitude=-76.967643');
          // funciones
          priceRequest.onload = addPrice;
          priceRequest.onerror = handleError;
          priceRequest.send();
        }

        function handleError() {
          console.log('se ha presentado un error');
        }

        function addPrice() {
          $('#showCost').empty();
          const data = JSON.parse(this.responseText);
          const response = data.prices;
          let centinel = 0;
          var distanceRoute = result.routes[0].legs[0].distance.value/1000;
          response.forEach(function(character) {
            let name= character.localized_display_name;
            var distance = character.distance;
            var priceEstimate = (character.high_estimate + character.low_estimate)/2;
            var costo = ((distanceRoute/distance)*priceEstimate).toFixed(2)+' soles';
            console.log(name + ':  ' + costo);

            var div = document.createElement('div');
            div.innerHTML = '<strong>'+ name +'</strong>'+ ': '+costo;
            document.getElementById('showCost').appendChild(div);
            // console.log(nameCharacter);
          });
        };
        console.log(originLat +'---'+ originLgn +'---'+destinyLat+'---'+destinyLng);
        directionsDisplay.setDirections(result);
        } else {
          alert('Algo ha salido mal, verifica que las direcciones se puedan recorrer en auto');
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
