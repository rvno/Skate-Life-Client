var userData;
var ref = new Firebase('https://skatelife.firebaseio.com/');

baseURL = 'https://skate-life-backend.herokuapp.com/';
// baseURL = 'http://localhost:3000/';




// Change this to onpage load?
$(function() {
  authenticateUser();
});



// Google Oauth
var authenticateUser = function() {
  $('.login-btn').on('click', function(event){
    event.preventDefault();

    googleOauth().then(function(authData) {
      googleData = authData;
      var gString = JSON.stringify(authData);
      window.localStorage.setItem('googleData', gString);
      $.mobile.loadPage('#main-map-page');
      $.mobile.changePage('#main-map-page');
      backendUserAuth(authData);
      buildUserProfile();
    });
  });
}



// Change Headers to User's Info
var buildUserProfile = function() {
  userData = JSON.parse(window.localStorage.getItem('googleData'));
  var firstName = userData.google.displayName.split(' ')[0];
  $('.username').text('Welcome ' + firstName);
  $('.welcome-header').text('Welcome ' + firstName);
}



// Authenticate user in heroku DB
var backendUserAuth = function(userData) {
  var path = baseURL + 'api/users/' + userData.google.id + '/authenticate'

  $.ajax({
    url: path,
    type: 'post',
    data: userData,
    dataType: 'json'
  })

  .done(function(response) {
    window.localStorage.setItem('currentUserId', response.id);
  })

  .fail(function(response) {
    console.log(response);
  });
}







$(document).on("pageinit", '#main-map-page',function(){

  $('.carousel').slick({
    arrows: false,
    focusOnSelect: true,
    mobileFirst: true,
    slidesToShow: 3,
    slidesToScroll: 3,
  });


  // $('.back-btn')
  //   .attr('href', '#')
  //   .attr('data-rel', '')
  //   .addClass('not-blue');

  var path = baseURL + 'api/skateparks/';
  $.ajax({
    url: path,
    method: 'get',
    dataType: 'json'
  })

  .done(function(response){
    

    // Refactor this big time
    $.each(response, function(index, skatepark){
      //implement carousel
      // $('.carousel').slick('slickAdd', '<div class="carousel-img"><img src="https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+skatepark.lat+','+skatepark.lon+'&fov=70&heading=235&pitch=0"/></div>')
      //end carousel
      buildSkateparkLink(skatepark, path);

   
    })
  })
  .fail(function(response){
    console.log('fail')
  })

});



var buildSkateparkLink = function(skatepark, path) {
  $('.skateparks').append(
    $('<li>').append(
      $('<a>')
        .addClass('skatepark-link')
        .attr('href', path+ skatepark.id)
        .text(skatepark.name)));
}





$(document).on("click", ".skatepark-link", function(e){
  e.preventDefault();
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
    $('#skatepark-page .ui-content .skatepark-page').html('<h1>'+response.name+'</h1><p>Address: '+response.address+'</p><p>Favorited: '+response.fav_count+'</p><img src="https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+response.lat+','+response.long+'&fov=70&heading=235&pitch=0"/><p class="skatepark-id" hidden>'+response.id+'</p>'
      )


    $.mobile.changePage('#skatepark-page');
  })
  .fail(function(response){
    console.log("failure")
  })
})

// BEGIN BUILDING MAP

//set default location to madagascar
var latitude = 37.76;
var longitude = -122.39;

//begin map
var dbc = new google.maps.LatLng(latitude, longitude)

var MY_MAPTYPE_ID = 'custom_style';

function initializeMap(){

  //begin custom color options
  var featureOpts = [
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
  //end custom color options

  var mapProp = {
    center:dbc,
    zoom:8,
    panControl:false,
    zoomControl:true,
    zoomControlOptions: {
      style:google.maps.ZoomControlStyle.LARGE,
    },
    mapTypeControl:false,
    scaleControl:false,
    streetViewControl:true,
    overviewMapControl:false,
    rotateControl:false,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID
  };

  // actually Build the map
  var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);



  //custom color segment//
  var styledMapOptions = {
    name: 'Custom Style'
  };
  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
  map.mapTypes.set(MY_MAPTYPE_ID, customMapType)
  //end custom color segment//
  //set your location marker to be where your current location is
  var marker = new google.maps.Marker({
    url:"#login-page",
    position:dbc,
    draggable: true,
    icon: "./imgs/user-icon.png"
  })

  marker.setMap(map)

  //this makes it so when we click on a marker, it redirects us to the marker's url
  google.maps.event.addListener(marker, 'click', function(){
    window.location.href = marker.url;
  })

  map.setTilt(0);


  $.ajax({
    url: baseURL + 'api/skateparks',
    type: 'get',
    dataType: 'json'
  })


// var myLatlng = new google.maps.LatLng(-25.363882,131.044922);

  .done(function(response) {
    var markers = [];


    $.each(response, function(index, skatepark) {
      // debugger
      // console.log(skatepark.lat);

      if (skatepark.lat[0] === '-') {
        var latParsed = skatepark.lat.substr(1);
        var lat = parseFloat(skatepark.lat);
      } else {
        var lat = parseFloat(skatepark.lat);
      }

      if (skatepark.lon[0] === '-') {
        var lonParsed = skatepark.lon.substr(1);
        var lon = parseFloat(skatepark.lon);
      } else {
        var lon = parseFloat(skatepark.lon);
      }

      // debugger

      var infowindow = new google.maps.InfoWindow({
           content: '<p>'+skatepark.name+'</p><p>'+skatepark.address+'</p><a class="skatepark-link" href='+baseURL+'api/skateparks/'+skatepark.id+'>check it</a><p><img src="https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+lat+','+lon+'&fov=70&heading=235&pitch=0"/></p>'
      });


      
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lon),
        title: skatepark.name,
        map: map,
        icon: "./imgs/rollerskate.png"
      });


      markers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
      });

    });

    var mc = new MarkerClusterer(map, markers);
    

  })

  .fail(function(response) {

  });
google.maps.event.trigger(map,'resize');
}


var onSuccess = function(position){

	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
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

//end google map

// authentication below

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





// before PANEL open event, load user favorites
$(document).on("panelbeforeopen", "#favoritesPanel", function(event, ui){
  // hit the route that goes to the user's favorites and append list items to show the favorite parks
  var userId = window.localStorage.getItem('currentUserId');
  var path = baseURL + 'api/users/' + userId + '/favorites'
  //modify path later to grab current user's user id
  $.ajax({
    url: path,
    method: 'get',
    dataType: 'json'
  })
  .done(function(response){
    console.log("hey harvey")
    $('.favorites').empty();
    // <li><a href="#">Default is right arrow</a></li>
    $.each(response, function(index, favorite){
      $('.favorites').prepend('<li><a class="skatepark-link" href='+baseURL+'api/skateparks/'+favorite.id+'>'+favorite.name+'</a></li>')
    })
    $('.favorites').append('<li id="logout"><a href="#">Logout</a></li>')
    $('.favorites').listview('refresh')
  })
  .fail(function(response){
    console.log("bye harvey")
  })
})

// allow user to favorite a map
$(document).on('click', '.favorite-button', function(){
  console.log(userData)
  var parkId = $('.skatepark-id').text()
  var userId = window.localStorage.getItem('currentUserId');
  var path = baseURL + 'api/users/' + userId + '/favorites/' + parkId
  $.ajax({
    url: path,
    method: 'post'
  })
  .done(function(response){
    console.log(response);
  })
  .fail(function(response){
    console.log(response);
    console.log('toadd')
  })

})


$(document).on("click", "#logout", function() {
  signOut();
});

$(document).on('popupbeforeposition', '.ui-popup', function(){
  console.log("hello")
  var parkId = $('.skatepark-id').text()
  var userId = window.localStorage.getItem('currentUserId');
  var path = baseURL + 'api/users/' + userId + '/favorites/'
  $.ajax({
    url: path,
    method: 'get',
    dataType: 'json'
  })
  .done(function(response){
    var pageParkId = $('.skatepark-id').text()
    var favoriteMatch = null;
    $.each(response,function(index, park){
      console.log(pageParkId)
      console.log(favoriteMatch)
      if(favoriteMatch === null){
        if(park.id == pageParkId){
          console.log("yup")
          $('#favoritePopup p').text('This skatepark has already been favorited.')
          favoriteMatch = true
          console.log("STOP DUDE")
        }
        else{
          console.log("no match buddy")
          console.log('this is the' + park.id)
          console.log('match' +pageParkId)
        }
      }
    });
    console.log($('#favoritePopup p').text())
    console.log("heyy hooo")
    console.log(response)
  })
  .fail(function(response){
    console.log("oh nooo")
  })
})

$(document).on('popupafteropen', '.ui-popup', function(){
  $(this).animate({ opacity: 100 });
  $(this).animate({ opacity: 0 }, 1500);
  
});

var signOut = function() {
  localStorage.clear();
  userData = null;
  $.mobile.changePage('#login-page')
}
