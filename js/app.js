var userData;
var ref = new Firebase('https://skatelife.firebaseio.com/');

baseURL = 'https://skate-life-backend.herokuapp.com/';
// baseURL = 'http://localhost:3000/';



// User Authentication

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

      // does this make it faster?
      $.mobile.loadPage('#main-map-page');
      $.mobile.changePage('#main-map-page');


      backendUserAuth(authData);
      buildUserProfile();
    });
  });
}


// google Oauth promise
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













// Main Map page

$(document).on("pageinit", '#main-map-page',function(){
  var path = baseURL + 'api/skateparks/';

  $('.carousel').slick({
    arrows: false,
    focusOnSelect: true,
    mobileFirst: true,
    slidesToShow: 3,
    slidesToScroll: 3,
  });


  $.ajax({
    url: path,
    method: 'get',
    dataType: 'json'
  })

  .done(function(response){

    // Only pull first 20 parks. Refactor this so that it's location based
    var i = 0;
    while (i < 20) {
      buildSkateparkLink(response[i], path);
      buildCarouselImage(response[i], path);
      i++;
    }

  })

  .fail(function(response){
    console.log('fail')
  });

});


var buildSkateparkLink = function(skatepark, path) {
  $('.skateparks').append(
    $('<li>').append(
      $('<a>')
        .addClass('skatepark-link')
        .attr('href', path+ skatepark.id)
        .text(skatepark.name)));
}


var buildCarouselImage = function(skatepark) {
  $('.carousel').slick('slickAdd',
    $('<div>').addClass('carousel-img').append(
      $('<img>').attr('src', 'https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+skatepark.lat+','+skatepark.lon+'&fov=70&heading=235&pitch=0')));
}

















// BEGIN BUILDING MAP

//set default location to SOMA
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


  .done(function(response) {
    var markers = [];

    // Refactor this
    $.each(response, function(index, skatepark) {

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
    console.log(response);
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


// Gonna see if this is needed
function onDeviceReady(){
  navigator.geolocation.getCurrentPosition(onSuccess, onError)
}

onDeviceReady();

google.maps.event.addDomListener(window, 'load', initializeMap);







// SkatePark Show Page

$(document).on("click", ".skatepark-link", function(event){
  event.preventDefault();
  var path = event.target.href

  $.ajax({
    url: path,
    method: 'get',
    dataType: 'json'
  })

  .done(function(response){
    buildSkateparkPage(response)
    $.mobile.changePage('#skatepark-page');
  })

  .fail(function(response){
    console.log("failure")
  });
});


var buildSkateparkPage = function(skatepark) {
  $('#skatepark-page .skatepark-name').text(skatepark.name.toUpperCase());
  var skateparkDiv = 
    $('<div>').append(
      $('<h1>').text(skatepark.name),
      $('<p>').text('Address: ' + skatepark.address),
      $('<p>').text('This spot has been favorited a whopping ' + skatepark.fav_count + 'times braski'),
      $('<img>').attr('src', 'https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+skatepark.lat+','+skatepark.lon+'&fov=70&heading=235&pitch=0'),
      $('<p>')
        .addClass('skatepark-id')
        .text(skatepark.id)
        .hide());

  $('#skatepark-page .ui-content .skatepark-page').html(skateparkDiv);
}











// Favorites Panel

$(document).on("panelbeforeopen", "#favoritesPanel", function(event, ui){
  var userId = window.localStorage.getItem('currentUserId');
  var path = baseURL + 'api/users/' + userId + '/favorites'

  if (userId) {
    $.ajax({
      url: path,
      method: 'get',
      dataType: 'json'
    })

    .done(function(response){
      $('.favorites').empty();
      $.each(response, function(index, favorite){
        $('.favorites').prepend('<li><a class="skatepark-link" href='+baseURL+'api/skateparks/'+favorite.id+'>'+favorite.name+'</a></li>')
      })

      $('.favorites').append(
        $('<li>').attr('id', 'logout').append(
        $('<a>').attr('href', '#').text('Logout')));

      $('.favorites').listview('refresh')
    })
    .fail(function(response){
      console.log("bye harvey")
    })

  } else {

    // fix this don't know why its not working
    $('.favorites').empty();
    $('.favorites').append(
      $('<li>').text('please login to see your favorites!'));

    // <a href="#main-map-page" class="ui-btn login-btn" data-rel="back" data-prefetch="">Login</a>
  }
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
