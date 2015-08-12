var ref = new Firebase('https://skatelife.firebaseio.com/');
var userData;



// $(document).on('pageinit', '#login-page', function (event) {
//   debugger
// });
// $('#login-page').
$(function() {
  debugger
  authenticateUser();
});


// MAKE SURE EVERY THING ELSE FIRES OFF AFTER THIS
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
  debugger
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

















