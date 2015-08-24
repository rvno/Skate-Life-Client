var map;
var MY_MAPTYPE_ID = 'custom_style';


// Figure out a way to optimize this, so that you
// don't see "Skater" before the name changes.
$(document).on('pageshow', '#login-page', function () {
  setHeader('.welcome-header');
});


// May not need event and data
$(document).on('pageshow', '#main-map-page', function (event, data) {
  setHeader('.username');

  setTimeout(function () {
    initializeMap();
    customizeMap();

    // Do this later
    // addLocationButtons();
    fetchSkateparks();


  }, 100);
});









var setHeader = function(header) {
  if (currentUser) {
    $(header).text('Welcome ' + currentUser.name);
  } else {
    $(header).text('Welcome Skater');
  }
}



var initializeMap = function() {
  var mapProps = {
    center: new google.maps.LatLng(37.663836, -122.080266),
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


var addLocationButtons = function() {
  // DO THIS LATER
}


var fetchSkateparks = function() {
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


var initializeSkateparkObjects = function(skateparks) {
  skateparks.forEach(function (skateparkData) {
    
    var skatepark = new Skatepark(skateparkData);
    skatepark.infoWindow = skatepark.buildInfoWindow();
    allSkateparks.push(skatepark);

    google.maps.event.addListener(skatepark.marker, 'click', function () {
      // getAttendees(skatepark.id);
      skatepark.infoWindow.open(map, skatepark.marker);
    });
  });

}
