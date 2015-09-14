var map;
var MY_MAPTYPE_ID = 'custom_style';


fetchSkateparks();

$.when(getCurrentLocation())
  .then(setCurrentUserPosition)
  .fail(setDefaultUserPosition);


// Figure out a way to optimize this, so that you
// don't see "Skater" before the name changes.
$(document).on('pagebeforeshow', '#login-page', function () {
  setHeader('.welcome-header');
});


$(document).on('pagebeforeshow', '#main-map-page', function () {
  setHeader('.username');
});

$(document).on('pageshow', '#main-map-page', function () {
  if (!map) {
    initializeMap();
    customizeMap();
    addLocationButtons();
    dropSkateparkPins();
    dropSkaterPins();
    listenForPositionChanges();
  }
});




var setHeader = function(header) {
  if (currentUser) {
    $(header).text('Welcome ' + currentUser.name);
  } else {
    $(header).text('Welcome Skater');
  }
}



var initializeMap = function() {
  // var currentMapCenter = currentUser.position;

  var mapProps = {
    center: currentUser.position,
    zoom:10,
    panControl:false,
    zoomControl:false,
    zoomControlOptions: {
      style:google.maps.ZoomControlStyle.LARGE,
    },
    mapTypeControl:false,
    scaleControl:true,
    streetViewControl:true,
    overviewMapControl:false,
    rotateControl:false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControlOptions: {
    mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID
  }

  map = new google.maps.Map(
    document.getElementById('googleMap'),
    mapProps
  );
}



var customizeMap = function() {
  var MY_MAPTYPE_ID = 'custom_style';
  var styledMapOptions = {name: 'Custom Style'}
  var featureOptions = [
    {
      stylers: [
        {hue: '#F2A516'},
        {visibility: 'simplified'},
        {gamma: 0.8},
        {weight: 0.5}
      ]
    },
    {
      featureType: 'water',
      stylers: [
        {color: '#2E2D2A'}
      ]
    }
  ];

  map.mapTypes.set(
    MY_MAPTYPE_ID, 
    new google.maps.StyledMapType(featureOptions, styledMapOptions)
  );
}

function fetchSkateparks() {
  $.ajax({
    url: baseURL + 'api/skateparks',
    type: 'get',
    dataType: 'json'
  })

  .done(function (response) {
    initializeSkateparkObjects(response);
  })

  .fail(function (response) {
    console.log(response);
  });
}


function initializeSkateparkObjects(skateparks) {
  skateparks.forEach(function (skateparkData) {
    var skatepark = new Skatepark(skateparkData);

    skatepark.infoWindow = skatepark.buildInfoWindow();
    allSkateparks.push(skatepark);
    buildCarouselElement(skatepark);
  });

}

var dropSkateparkPins = function() {
  allSkateparks.forEach(function (skatepark) {
    skatepark.initializeSkateparkMarker();
  });
}


var dropSkaterPins = function() {
  userMarkers = [];

  userMarkerRef.on('child_added', function (snapshot) {
    var userMarker = snapshot.val()
    var markerPosition = new google.maps.LatLng(userMarker.position.G, userMarker.position.K);

    if (userMarker.uid === currentUser.uid) {
      var draggability = true;
      var iconPath = './imgs/main-user-icon.png'
    } else {
      var draggability = false;
      var iconPath = './imgs/other-skaters.png'
    }

    var marker = new google.maps.Marker({
      url: '#login-page',
      uid: userMarker.uid,
      position: markerPosition,
      draggable: draggability,
      icon: iconPath
    });

    if (marker.uid === currentUser.uid) {
      currentUser.marker = marker;
      currentUser.marker.setMap(map);
      currentUser.initializeGeofence();
      currentUser.bindDragListener();

      userMarkers.push(currentUser.marker);
      currentUser.populateCarousel();
    } else {
      marker.setMap(map);

      userMarkers.push(marker);
    }

  });

}

var listenForPositionChanges = function() {
  userMarkerRef.on('child_changed', function (snapshot) {
    var position = snapshot.val().position;
    var markerPosition = new google.maps.LatLng(position.G, position.K);

    userMarkers.forEach(function (marker) {
      if (snapshot.val().uid === marker.uid) {
        marker.setPosition(markerPosition);
      }
    });
  });

  userMarkerRef.on('child_removed', function (snapshot) {
    userMarkers.forEach(function (marker) {
      if (snapshot.val().uid === marker.uid) {
        var index = userMarkers.indexOf(marker);
        marker.setMap(null);
        userMarkers.splice(index, 1);
      }
    });
  });
}


