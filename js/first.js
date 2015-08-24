var currentLocation;


var setCurrentUserPosition = function(position) {
  currentLocation = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );
}

var onError = function() {
  alert('code: '    + error.code    + '\n' + 
        'message: ' + error.message + '\n');
}

var getCurrentLocation = function() {
  navigator.geolocation.getCurrentPosition(setCurrentUserPosition, onError);
}

getCurrentLocation();