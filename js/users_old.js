// var ref = new Firebase('https://skatelife.firebaseio.com/');
// var baseURL = 'https://skate-life-backend.herokuapp.com/';
// var userData;
// var currentUserId;


$(function() {
  authenticateUser();
  bindAttendanceListener();
});


// MAKE SURE EVERYTHING ELSE FIRES OFF AFTER THIS
// REDIRECT


// Authenticate User with Google info first
// before checkin for them in DB
var authenticateUser = function() {
  $('.login-btn').on('click', function(event) {
    event.preventDefault();

    googleOauth().then(function(authData) {
      var gString = JSON.stringify(authData);
      window.localStorage.setItem('googleData', gString);

      $.mobile.loadPage('#main-map-page');
      $.mobile.changePage('#main-map-page');

      backendUserAuth(authData);
      buildUserProfile();
    });
  });
}



// google Oauth promise that will wait for auth
var googleOauth = function() {
  var promise = new Promise(function (resolve, reject) {
    ref.authWithOAuthPopup('google', function (error, authData) {
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



// Store user info and manipulate headers on Dom upon
// Authentication
var buildUserProfile = function() {
  userData = JSON.parse(window.localStorage.getItem('googleData'));
  var firstName = userData.google.displayName.split(' ')[0];
  $('.username').text('Welcome ' + firstName);
  $('.welcome-header').text('Welcome ' + firstName);
}



// Authenticate User with what we have in our DB,
// If no uid matches we create a new user
var backendUserAuth = function(userData) {
  var path = baseURL + 'api/users/' + userData.google.id + '/authenticate'

  $.ajax({
    url: path,
    type: 'post',
    data: userData,
    dataType: 'json'
  })

  .done(function (response) {
    window.localStorage.setItem('currentUserId', response.id);
    currentUserId = window.localStorage.getItem('currentUserId');
  })

  .fail(function (response) {
    console.log(response);
  });
}












// FAVORITES & CHAT PANELS


var externalPanel = '<div data-role="panel" id="favoritesPanel" data-display="overlay" data-theme="b"><a href="#" data-rel="close" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left" data-prefetch >Close Favorites</a><ul data-role="listview" class="favorites"><li id="logout"><a href="#">Logout</a></li></ul></div>';
// var chatPanel = '<div data-role="panel" id="chatPanel" data-display="overlay" data-position="right" data-theme="b"><a href="#" data-rel="close" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-right" data-prefetch >Close Messages</a><ul data-role="listview" class="chat-messages"></ul></div>';

$(document).on('pagebeforecreate', function(){
  $.mobile.pageContainer.prepend(externalPanel);
  $('#favoritesPanel').panel().enhanceWithin();
  // $.mobile.pageContainer.prepend(chatPanel);
  // $('#chatPanel').panel().enhanceWithin();
})


// Build favorites panel whenever user opens it
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

      // empty out favorites panel and repopulate it with user's favs
      $('.favorites').empty();
      $('.favorites').prepend(
        $('<li>').attr('id', 'logout').append(
        $('<a>').attr('href', '#').text('Logout')));

      $.each(response, function(index, favorite){
        $('.favorites').append(
          $('<li>').append(
            $('<a>')
              .attr('href', baseURL + 'api/skateparks/' + favorite.id)
              .addClass('skatepark-link')
              .text(favorite.name)));
      });


      $('.favorites').listview('refresh')
      $('#logout > a').removeClass('ui-btn-icon-right ui-icon-carat-r')
    })
    .fail(function(response){
      console.log(response);
    })

  } else {

    // fix this don't know why its not working
    $('.favorites').empty();
    $('.favorites').append(
      $('<li>').text('Login to see your favorites.'));
    $('.favorites').prepend(
        $('<li>').attr('id', 'logout').append(
        $('<a>').attr('href', '#').text('Login')));
    $('.favorites').listview('refresh');
    $('#logout > a').removeClass('ui-btn-icon-right ui-icon-carat-r')

  }
})




// // CHAT PANEL (INSERT FIREBASE RELATED LOGIC HERE)
// $(document).on("panelbeforeopen", "#chatPanel", function(event, ui){
//   var userId = window.localStorage.getItem('currentUserId');
//   // var path = baseURL + 'api/users/' + userId + '/favorites'
//   if (userId) {
//     console.log('somebody talk to me plz')
//   } else {

//     // fix this don't know why its not working
//     $('.chat-messages').empty();
//     $('.chat-messages').append(
//       $('<li>').text('Login to check your messages.'));
//     $('.chat-messages').prepend(
//         $('<li>').attr('id', 'logout').append(
//         $('<a>').attr('href', '#').text('Login')));
//     $('.chat-messages').listview('refresh');
//     $('#logout > a').removeClass('ui-btn-icon-right ui-icon-carat-r')

//   }
// })




// allow user to favorite a map
$(document).on('click', '.favorite-button', function(event){
  // var favoriteEvent = event
  var match = null;
  //if there's a user..check their favorites to see if the park has already been added
  if(userData){

    var parkId = $('.skatepark-id').text()
    //try to iterate through, if a match is found, change the popup text
    $.each(favoriteSkateparks, function(index, favoritedPark){
      if(favoritedPark.id == parkId){
        console.log('we have a match')
        $('#favoritePopup p').text('This skatepark has already been favorited.')
        $('#favoritePopup').popup('open');
        match = true;
        event.preventDefault();
      }
      else{
        event.preventDefault();
      }
    })

    if(match === null){
      var userId = window.localStorage.getItem('currentUserId');
      var path = baseURL + 'api/users/' + userId + '/favorites/' + parkId
      $.ajax({
        url: path,
        method: 'post'
      })
      .done(function(response){
        $('#favoritePopup p').text("Added to your favorites!")
        $('#favoritePopup').popup('open')
      })
      .fail(function(response){
      })
    } 
  }

  else {
    event.preventDefault();
    $('#favoriteErrorPopup').popup("open")
  }

})




$(document).on("click", "#logout", function() {
  signOut();
  $('.username').text('Welcome Skater');
  $('.welcome-header').text('Skate Life, Breh');
});


$(document).on('popupafteropen', '.ui-popup', function(){
  $(this).animate({ opacity: 100 });
  $(this).animate({ opacity: 0 }, 1500);

});


var signOut = function() {
  localStorage.clear();
  userData = null;
  currentUserId = null;
  $.mobile.changePage('#login-page')
}


var bindAttendanceListener = function() {
  $(document).on('click', '.attend', function(event) {

    var parkId = $(event.target).siblings('p:first-child').text();
    var path = baseURL + 'api/users/' + currentUserId + '/skateparks/' + parkId;
    var attendButton = this;

    // grabs all users attending current park

    $.ajax({
      url: path,
      type: 'post'
    })

    .done(function(response) {
      getSkaters(parkId);
      // THIS STAYS AS LEAVE NO MATTER WHAT, MAYBE FIX
      $(attendButton)
        .toggleClass('attend leave')
        .text('Leave');
    })

    .fail(function(response) {
      console.log(response);
      alert('U GOTTA LOG IN BRAWSKI');
    })


  });

  $(document).on('click', '.leave', function(event) {
    var parkId = $(event.target).siblings('p:first-child').text();
    var path = baseURL + 'api/users/' + currentUserId + '/skateparks/' + parkId;
    var leaveButton = this;


    $.ajax({
      url: path,
      type: 'delete'
    })

    .done(function(response) {
      getSkaters(parkId);

      $(leaveButton)
        .toggleClass('leave attend')
        .text('Attend');
    })

    .fail(function(response) {
      console.log(response);
    })



  });
}



// Grab all attendees of a skatepark
var getSkaters = function(skateparkId) {
  var path = baseURL + 'api/skateparks/' + skateparkId + '/attendees';

  $.ajax({
    url: path,
    type: 'get',
    dataType: 'json'
  })

  .done(function(response){
    var park = $('.park-id:contains('+skateparkId+')')
    park.siblings('.skater_count').text('Current Skaters: ' + response.length);

  })

  .fail(function(response){
    console.log(response)
  });
};



// ADD IN BIND ATTENDANCE LISTENER















