var currentLocation;


var setCurrentUserPosition = function(position) {
  currentLocation = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );
  console.log('got current location');
  // debugger
}

var onError = function() {
  alert('code: '    + error.code    + '\n' + 
        'message: ' + error.message + '\n');
}

var getCurrentLocation = function() {
  navigator.geolocation.getCurrentPosition(setCurrentUserPosition, onError);
}

getCurrentLocation();