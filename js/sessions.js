var ref = new Firebase('https://skatelife.firebaseio.com/');
var baseURL = 'https://skate-life-backend.herokuapp.com';
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

  // REMOVE THIS AND PUT IT ON MAIN MAP PAGE
  $('.userame').text('Welcome Skater');
  $('.welcome-header').text('Skate Life, Breh');
});







var authenticateUserOnLogin = function() {
  googleOauth().then(function(authData) {
    window.localStorage.setItem(
      'googleData',
      JSON.stringify(authData));

    // Verify if this makes any difference
    $.mobile.loadPage('#main-map-page');
    $.mobile.changePage('#main-map-page');

    backendUserAuth(authData);
    buildUserProfile();
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



var buildUserProfile = function() {
  userData = JSON.parse(window.localStorage.getItem('googleData'));
  var firstName = userData.google.displayName.split(' ')[0];

  // EVENTUALLY DO THIS ON MAIN MAP PAGE
  $('.username').text('Welcome ' + firstName);
  $('.welcom-header').text('Welcome ' + firstName);
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
  userData = null;
  currentUserId = null;
  $.mobile.changePage('#login-page');
}




