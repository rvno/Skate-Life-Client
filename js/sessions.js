var ref = new Firebase('https://skatelife.firebaseio.com/');
var baseURL = 'https://skate-life-backend.herokuapp.com';

// Get rid of this and make it a local variable when needed
var userData;
var currentUserId;




// Sign In
$(document).on('click', '.login-btn', function (event) {
  event.preventDefault();
  authenticateUserOnLogin();
});


// Sign Out
$(document).on('click', '#logout', function () {
  signOut();
});







var authenticateUserOnLogin = function() {
  googleOauth().then(function(authData) {
    window.localStorage.setItem(
      'googleData',
      JSON.stringify(authData));

    backendUserAuth(authData);
    initializeUserObject();

    // Verify if this makes any difference
    $.mobile.loadPage('#main-map-page');
    $.mobile.changePage('#main-map-page');

  });
}


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


var initializeUserObject = function() {

  // possibly turn this into a local variable
  userData = JSON.parse(window.localStorage.getItem('googleData'));
  currentUser = new User(userData.google);
}


var backendUserAuth = function(userData) {
  var path = baseURL + 'api/users/' + userData.google.id + '/authenticate'

  $.ajax({
    url: path,
    type: 'post',
    data: userData,
    dataType: 'json'
  })

  .done(function (response) {
    currentUserId = response.id;
    window.localStorage.setItem('currentUserId', currentUserId);
  })

  .fail(function (response) {
    console.log(response);
  });
}



var signOut = function() {
  localStorage.clear();
  currentUser = null;

  // eventually get rid of these two
  userData = null;
  currentUserId = null;

  $.mobile.changePage('#login-page');
}




