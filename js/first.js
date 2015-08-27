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

var addLocationButtons = function() {
  var homeControlDiv = document.createElement('div');
  var homeControl = new HomeControl(homeControlDiv, map);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
}


function HomeControl(controlDiv, map) {
  controlDiv.style.padding = '5px';
  controlDiv.id = 'home-control-div';

  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'orange';
  controlUI.style.color = 'black';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'current location';
  controlUI.id="map-home-btn";
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial, sans-serif';
  controlText.style.fontSize='12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<p>Home<p>'
  controlUI.appendChild(controlText);

  google.maps.event.addDomListener(controlUI, 'click', function () {
    map.setCenter(currentUser.position);
  });

}






// Call this somewhere else as a promise
getCurrentLocation();

