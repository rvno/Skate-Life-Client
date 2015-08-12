var ref = new Firebase('https://skatelife.firebaseio.com/');
var baseURL = 'https://skate-life-backend.herokuapp.com/';
var userData;


$(function() {
  authenticateUser();
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
  })

  .fail(function (response) {
    console.log(response);
  });
}









// Favorites Panel DEFINITELY gonna refactor this

$(document).on("panelbeforeopen", "#favoritesPanel", function(event, ui){
  debugger
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
      $('<li>').text('Login to see your favorites.'));
    $('.favorites').prepend(
        $('<li>').attr('id', 'logout').append(
        $('<a>').attr('href', '#').text('Login')));
    $('.favorites').listview('refresh');
    $('#logout > a').removeClass('ui-btn-icon-right ui-icon-carat-r')

  }
})

// allow user to favorite a map
$(document).on('click', '.favorite-button', function(event){

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
    })
  } else {
    event.preventDefault();
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

















