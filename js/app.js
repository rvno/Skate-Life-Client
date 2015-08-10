var ref = new Firebase("https://skatelife.firebaseio.com");


baseURL = 'https://skate-life-backend.herokuapp.com/';


$(function() {
  authenticatUser();
  // buildUserProfile();
});


var authenticatUser = function() {
  $('.login-btn').on('click', function(event){
    event.preventDefault();

    googleOauth().then(function(authData) {
      googleData = authData;
      var gString = JSON.stringify(authData);
      window.localStorage.setItem('googleData', gString);
      $.mobile.changePage('#main-map-page');
      buildUserProfile();
    });
    // .dispatchEvent(event);
  });
}

var buildUserProfile = function() {
  var userData = JSON.parse(window.localStorage.getItem('googleData'));
  var firstName = userData.google.displayName.split(' ')[0];
  $('.username').text('Welcome ' + firstName);
  // $("#main-map-page").prepend($('<img>').attr("src", userData.google.profileImageURL))
}



$(document).on("pageinit", '#main-map-page',function(){
  // alert("the next page is loading");
  console.log(baseURL);
  var path = baseURL + 'api/skateparks/';
  $.ajax({
    url: path,
    method: 'get',
    dataType: 'json'
  })
  .done(function(response){
    console.log('done')
    $.each(response, function(index, skatepark){
      $('.skateparks').append(
        $('<li>').append(
          $('<a>')
            .addClass('skatepark-link')
            .attr('href', path+ skatepark.id)
            // .attr('id', park.name)
            .text(skatepark.name)));

    })
  })
  .fail(function(response){
    console.log('fail')
  })

});




$(document).on("click", ".skatepark-link", function(e){
  e.preventDefault();
  // $('#skatepark-page .ui-content .skatepark-page').text('supppp')
  console.log(e.target.href)
  var path = e.target.href
  $.ajax({
    url: path,
    method: 'get',
    dataType: 'json'
  })
  .done(function(response){
    console.log(response)
    if(response.name.includes("skatepark")){
      response.name
    }
    else{
      response.name = response.name + " skatepark"
    }

    $('#skatepark-page .skatepark-name').text(response.name.toUpperCase());
    $('#skatepark-page .ui-content .skatepark-page').html('<h1>'+response.name+'</h1><p>Address: '+response.address+'</p><p>Favorited: '+response.fav_count+'</p>'
      )

    // text(response.name + response.address + response.fav_count)
    // window.location.replace('#skatepark-page')
    $.mobile.changePage('#skatepark-page');
  })
  .fail(function(response){
    console.log("failure")
  })
  // window.location.replace('#skatepark-page')
})

// $(document).ready(function(){

// BEGIN BUILDING MAP



var latitude = -17.201472;
var longitude = 46.977282;

var dbc = new google.maps.LatLng(latitude, longitude)

function initializeMap(){
  var mapProp = {
    center:dbc,
    zoom:17,
    mapTypeId:google.maps.MapTypeId.HYBRID,
    panControl:false,
    zoomControl:true,
    zoomControlOptions: {
      style:google.maps.ZoomControlStyle.SMALL,
      // position:google.maps.ControlPosition.BOTTOM_RIGHT
    },
    mapTypeControl:false,
    scaleControl:false,
    streetViewControl:true,
    overviewMapControl:false,
    rotateControl:false,
  };

  // actually Build the map
  var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
  map.setTilt(0); //tilt is the angle at which you view the map (think bird's eye)
  // Grab radius of skatepark
  // var skateparkRadius = new google.maps.Circle({
  //   center:portrero,
  //   radius:50,
  //   strokeColor:"#0000FF",
  //   strokeOpacity:1,
  //   strokeWeight:2,
  //   fillColor:"#0000FF",
  //   fillOpacity:0.4
  // });
  //skateparkRadius.setMap(map);
  // THE SECTION ABOVE REPRESENTS THE BLUE CIRCLE FOR GEOFENCING, NOT MVP

}

var onSuccess = function(position){
	// alert('Latitude: '          + position.coords.latitude          + '\n' +
	//          'Longitude: '         + position.coords.longitude         + '\n' +
	//          'Altitude: '          + position.coords.altitude          + '\n' +
	//          'Accuracy: '          + position.coords.accuracy          + '\n' +
	//          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	//          'Heading: '           + position.coords.heading           + '\n' +
	//          'Speed: '             + position.coords.speed             + '\n' +
	//          'Timestamp: '         + position.timestamp                + '\n');
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	// alert(latitude + "," + longitude)
	dbc = new google.maps.LatLng(latitude, longitude)
	initializeMap();	
}

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){

	navigator.geolocation.getCurrentPosition(onSuccess, onError)

}

onDeviceReady();

google.maps.event.addDomListener(window, 'load', initializeMap);


// authentication below

// fbAuth().then(function(authData){
//       fbData = authData;
//       var fbString = JSON.stringify(authData);
//       window.localStorage.setItem("fbData", fbString);
//       ajaxLogin(authData);
//       setProfile(authData);
//     });








var googleOauth = function() {
  var promise = new Promise(function(resolve, reject) {
    ref.authWithOAuthPopup('google', function(error, authData) {
      if (error) {
        alert('login failed!');
        reject(error);
      } else {
        resolve(authData);
      }
    });
  });
  return promise;
}


// var fbAuth = function(){
//   var promise = new Promise(function(resolve, reject){
//     ref.authWithOAuthPopup("facebook", function(error, authData) {
//       if (error) {
//         alert("login failed!");
//         reject(error);
//       } else {
//         resolve(authData);
//       };
//     });
//   })
//   return promise;
// };
