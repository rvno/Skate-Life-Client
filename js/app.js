var userData;
var ref = new Firebase('https://skatelife.firebaseio.com/');
markers = [];
geoMarkers = [];
var userMarker;

// var messageRef = 'https://skatelife.firebaseio.com/parkchats/';
var lastMessage;
var lastSkatepark;
var map;
// var userMarker;

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

  // $('.carousel').slick({
  //   arrows: false,
  //   focusOnSelect: true,
  //   mobileFirst: true,
  //   slidesToShow: 3,
  //   slidesToScroll: 3,
  // });

  $.ajax({
    url: path,
    method: 'get',
    dataType: 'json'
  })

  .done(function(response){

    $.each(response, function(index, skatepark){
      //implement carousel

      //end carousel
      $('.skateparks').append(
        $('<li>').append(
          $('<a>')
            .addClass('skatepark-link')
            .attr('href', path+ skatepark.id)
            // .attr('id', park.name)
            .text(skatepark.name)));

    })

    // Only pull first 20 parks. Refactor this so that it's location based
    var i = 0;
    while (i < 8) {
      buildSkateparkLink(response[i], path);
      // buildCarouselImage(response[i], path);
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
var count = 0;
var buildCarouselImage = function(skatepark) {
  $('.carousel').slick('slickAdd',
    $('<div>').addClass('carousel-img').append(
      $('<img>').attr('src', 'https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+skatepark.lat+','+skatepark.lon+'&fov=70&heading=235&pitch=0')));
}

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

// 	latitude = position.coords.latitude;
// 	longitude = position.coords.longitude;
// 	dbc = new google.maps.LatLng(latitude, longitude)

// 	initializeMap();
// }

// function onError(error) {
//     alert('code: '    + error.code    + '\n' +
//           'message: ' + error.message + '\n');
// }

// document.addEventListener("deviceready", onDeviceReady, false);

// function onDeviceReady(){

// 	navigator.geolocation.getCurrentPosition(onSuccess, onError)

// }


// onDeviceReady();

// google.maps.event.addDomListener(window, 'load', initializeMap);
//COMMENTED OUT LINES 288 - 313 FOR MAP








// SkatePark Show Page

$(document).on("click", ".skatepark-link", function(event){
  event.preventDefault();
  var path = event.target.href
  var skatepark = event.target.text

  if (skatepark !== lastSkatepark) {
    clearChat();
  }


  $.ajax({
    url: path,
    method: 'get',
    dataType: 'json'
  })

  .done(function(response){
    initializeChatroom(skatepark);

    buildSkateparkPage(response)
    $.mobile.changePage('#skatepark-page');
  })

  .fail(function(response){
    console.log("failure")
  });
});



var initializeChatroom = function(skatepark) {
  var skateparkURL = skatepark.split(' ')[0];
  var messageRef = new Firebase('https://skatelife.firebaseio.com/parkchats/' + skatepark);
  // userData = JSON.parse(window.localStorage.getItem('googleData'));
  if (userData) {
    var firstName = userData.google.displayName.split(' ')[0];
    $('.chat-user').text(firstName);
  }

  messageRef.on('child_added', function (snapshot){
    var message = snapshot.val();

    if (message.text !== lastMessage && message !== '') {
      $('.messages-div').append(
        $('<div>').addClass('message').append(
            $('<p>').text(message.name + ': ' + message.text)));
    }

    lastMessage = message.text
    lastSkatepark = skatepark
  });




  $('#message-submit').on('click', function (event) {

    event.preventDefault();


    // var name = $('#name-input').val();
    var name = $('.chat-user').text();
    var text = $('#message-input').val();

    var message = text;

    if (message !== lastMessage && message !== '') {
      messageRef.push({name: name, text: text});
      $('#message-input').val('');
    }

    var lastMessage = text;

  });

}


var clearChat = function() {
  $('.messages-div').empty();
}


// $('.back-btn').on('click', function(event) {
//   debugger
//   clearChat();
// });

// $(document).on('click','.back-btn', function(event) {
//   debugger
//   clearChat();
// });

// $(document).on('click', '.home-btn', function(event) {
//   clearChat();
// });













var buildSkateparkPage = function(skatepark) {
  $('#skatepark-page .skatepark-name').text(skatepark.name.toUpperCase());
  var skateparkDiv =
    $('<div>').append(
      $('<h1>').text(skatepark.name),
      $('<p>').text('Address: ' + skatepark.address),
      $('<p>').text('This spot has been favorited a whopping ' + skatepark.fav_count + 'times braski'),
      $('<img >').attr('src', 'https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+skatepark.lat+','+skatepark.lon+'&fov=70&heading=235&pitch=0'),
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
      // debugger
      $.each(response, function(index, favorite){
        $('.favorites').append('<li><a class="skatepark-link" href='+baseURL+'api/skateparks/'+favorite.id+'>'+favorite.name+'</a></li>')
      })

      $('.favorites').prepend(
        $('<li>').attr('id', 'logout').append(
        $('<a>').attr('href', '#').text('Logout')));

      $('.favorites').listview('refresh')
      $('#logout > a').removeClass('ui-btn-icon-right ui-icon-carat-r')
    })
    .fail(function(response){
      console.log("bye harvey")
    })

  } else {

    // fix this don't know why its not working
    $('.favorites').empty();
    $('.favorites').append(
      $('<li>').text('please login to see your favorites!'));
    $('.favorites').prepend(
        $('<li>').attr('id', 'logout').append(
        $('<a>').attr('href', '#').text('Logout')));
    $('.favorites').listview('refresh');
    $('#logout > a').removeClass('ui-btn-icon-right ui-icon-carat-r')

  }
})

// allow user to favorite a map
$(document).on('click', '.favorite-button', function(event){
  console.log(userData)

  if(userData){
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
  }
  else{
    event.preventDefault();
    console.log("you cannot do that")
    $('#favoriteErrorPopup').popup("open")
  }

})


$(document).on("click", "#logout", function() {
  signOut();
  $('.username').text('Welcome Skater');
  $('.welcome-header').text('Skate Life, Breh');
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









//CHANGE MAP SIZE AND INITIALIZATION LOCATION
var latitude = 37.663836;
var longitude = -122.080266;
$(document).on('pageshow', '#main-map-page', function (e, data) {
  setTimeout(function () {
  // This is the minimum zoom level that we'll allow
    var MY_MAPTYPE_ID = 'custom_style';
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

    var mapProps = {

          center: new google.maps.LatLng(37.76, -122.39),
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
    map = new google.maps.Map(document.getElementById('googleMap'),
      mapProps
    );
    var styledMapOptions = {
        name: 'Custom Style'
    };

    var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
    map.mapTypes.set(MY_MAPTYPE_ID, customMapType)

    //SET MARKER TO BE AT DBC (MAKE IT VARIABLE LATER)
    dbc = new google.maps.LatLng(latitude, longitude)
    createNewUserMarker(map);
    

  //END MARKER SETUP

    $.ajax({
      url: baseURL + 'api/skateparks',
      type: 'get',
      dataType: 'json'
    })



    .done(function(response) {


      $.each(response, function(index, skatepark) {

        // DO THIS IN RUBY
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
               content: '<p class="center">'+skatepark.name+'</p><p class="center">'+skatepark.address+'</p><a class="skatepark-link center" href='+baseURL+'api/skateparks/'+skatepark.id+'>check it</a><p class="center center-img"><img src="https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+lat+','+lon+'&fov=70&heading=235&pitch=0"/></p>'
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

      //------------------GEOfence----------------------------//

        // Grab current latitude and longitude coordinates


          // Construct geofence circle
        var currentGeofence = new google.maps.Circle({
          map: map,
          radius: 9001,
          fillColor: '#336688',
          fillOpacity: .22,
          strokeColor: '#D48817',
          strokeWeight: 1.75
        });


      currentGeofence.bindTo('center', userMarker, 'position');

      $('.carousel').slick({
        arrows: false,
        focusOnSelect: true,
        mobileFirst: true,
        slidesToShow: 8,
        slidesToScroll: 3,
      });







        //-----------------------CAROUSEL ADDING AND REMOVING-------------------------//


      markers.forEach(function(marker){
        if (currentGeofence.getBounds().contains(marker.position)) {
          var skatepark = {lat: marker.position.G, lon: marker.position.K }
          buildCarouselImage(skatepark);
          geoMarkers.push(marker);
        }
      });

        google.maps.event.addListener(userMarker, 'dragend', function(){
          $('.carousel-img').remove();

          markers.forEach(function(marker){
            if (currentGeofence.getBounds().contains(marker.position)) {
              var skatepark = {lat: marker.position.G, lon: marker.position.K }
              buildCarouselImage(skatepark);
              geoMarkers.push(marker);
            }
          });
        });



    })

    .fail(function(response) {

    });

  }, 100);

});



// Function for creating a User marker and associating it with data in firebase
// Hardcoding in User Position until Harvey grabs current location from phone


// This sets up reference to firebase database
var userMarkerRef = new Firebase('https://skatelife.firebaseio.com/markers/');

var createNewUserMarker = function(map) {
  var firebaseMarker = {
    url: '#login-page',
    position: dbc,
    draggable: true,
    icon: './imgs/user-icon.png'
  }


  userMarkerRef.push(firebaseMarker);

}


userMarkerRef.on('child_added', function (snapshot) {
  var markerPosition = snapshot.val().position;
  var position = new google.maps.LatLng(markerPosition.G, markerPosition.K);

  var marker = new google.maps.Marker({
    url: '#login-page',
    position: position,
    draggable: true,
    icon: './imgs/user-icon.png'
  });

  marker.setMap(map);
  userMarker = marker;
});


// IMPLEMENT GEOLOCATION BELOW TO GET USER'S CURRENT POSITION
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



