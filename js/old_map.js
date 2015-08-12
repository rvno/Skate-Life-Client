// // BEGIN BUILDING MAP

// //set default location to madagascar
// var latitude = 37.76;
// var longitude = -122.39;

// //begin map
// var dbc = new google.maps.LatLng(latitude, longitude)

// var MY_MAPTYPE_ID = 'custom_style';

// function initializeMap(){

//   //begin custom color options
//   var featureOpts = [
//     {
//       stylers: [
//         {hue: '#F2A516'},
//         {visibility: 'simplified'},
//         {gamma: 0.8},
//         {weight: 0.5}
//       ]
//     },
//     {
//       featureType: 'water',
//       stylers: [
//         {color: '#2E2D2A'}
//       ]
//     }
//   ];
//   //end custom color options

//   var mapProp = {
//     center:dbc,
//     zoom:8,
//     panControl:false,
//     zoomControl:true,
//     zoomControlOptions: {
//       style:google.maps.ZoomControlStyle.LARGE,
//     },
//     mapTypeControl:false,
//     scaleControl:false,
//     streetViewControl:true,
//     overviewMapControl:false,
//     rotateControl:false,
//     mapTypeControlOptions: {
//       mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
//     },
//     mapTypeId: MY_MAPTYPE_ID
//   };

//   // actually Build the map
//   var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);



//   //custom color segment//
//   var styledMapOptions = {
//     name: 'Custom Style'
//   };
//   var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
//   map.mapTypes.set(MY_MAPTYPE_ID, customMapType)
//   //end custom color segment//
//   //set your location marker to be where your current location is
//   var marker = new google.maps.Marker({
//     url:"#login-page",
//     position:dbc,
//     draggable: true,
//     icon: "./imgs/user-icon.png"
//   })

//   marker.setMap(map)

//   //this makes it so when we click on a marker, it redirects us to the marker's url
//   google.maps.event.addListener(marker, 'click', function(){
//     window.location.href = marker.url;
//   })

//   map.setTilt(0);


//   $.ajax({
//     url: baseURL + 'api/skateparks',
//     type: 'get',
//     dataType: 'json'
//   })


// // var myLatlng = new google.maps.LatLng(-25.363882,131.044922);

//   .done(function(response) {
//     var markers = [];


//     $.each(response, function(index, skatepark) {
//       // debugger
//       // console.log(skatepark.lat);

//       if (skatepark.lat[0] === '-') {
//         var latParsed = skatepark.lat.substr(1);
//         var lat = parseFloat(skatepark.lat);
//       } else {
//         var lat = parseFloat(skatepark.lat);
//       }

//       if (skatepark.lon[0] === '-') {
//         var lonParsed = skatepark.lon.substr(1);
//         var lon = parseFloat(skatepark.lon);
//       } else {
//         var lon = parseFloat(skatepark.lon);
//       }

//       // debugger

//       var infowindow = new google.maps.InfoWindow({
//            content: '<p>'+skatepark.name+'</p><p>'+skatepark.address+'</p><a class="skatepark-link" href='+baseURL+'api/skateparks/'+skatepark.id+'>check it</a><p><img src="https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+lat+','+lon+'&fov=70&heading=235&pitch=0"/></p>'
//       });

//       var marker = new google.maps.Marker({
//         position: new google.maps.LatLng(lat,lon),
//         title: skatepark.name,
//         map: map,
//         icon: "./imgs/rollerskate.png"
//       });


//       markers.push(marker);

//       google.maps.event.addListener(marker, 'click', function() {
//           infowindow.open(map,marker);
//       });

//     });

//     var mc = new MarkerClusterer(map, markers);



//   })

//   .fail(function(response) {

//   });
// google.maps.event.trigger(map,'resize');
// }
// COMMENTED OUT LINES 139-284

// var onSuccess = function(position){

//  latitude = position.coords.latitude;
//  longitude = position.coords.longitude;
//  dbc = new google.maps.LatLng(latitude, longitude)

//  initializeMap();
// }

// function onError(error) {
//     alert('code: '    + error.code    + '\n' +
//           'message: ' + error.message + '\n');
// }

// document.addEventListener("deviceready", onDeviceReady, false);

// function onDeviceReady(){

//  navigator.geolocation.getCurrentPosition(onSuccess, onError)

// }


// onDeviceReady();

// google.maps.event.addDomListener(window, 'load', initializeMap);
//COMMENTED OUT LINES 288 - 313 FOR MAP