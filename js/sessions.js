var oAuthRef = new Firebase('https://skatelife.firebaseio.com/');
var baseURL = 'https://skate-life-backend.herokuapp.com';
var userData;
var currentUserId;




var authenticateUserOnLogin = function() {
  $('.login-btn').on('click', function(event) {
    event.preventDefault();

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
  });
}



var googleOauth = function() {
  var promise = new Promise(function (resolve, reject) {
    oAuthRef.authWithOAuthPopup('google', function (error, authData) {
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




// FAVORITES & CHAT PANEL WOULD NORMALLY BE HERE




var signOut = function() {
  localStorage.clear();
  userData = null;
  currentUserId = null;
  $.mobile.changePage('#login-page');
}




// Sign In
authenticateUserOnLogin();


// Sign Out
$(document).on('click', '#logout', function () {
  signOut();

  // REMOVE THIS AND PUT IT ON MAIN MAP PAGE
  $('.userame').text('Welcome Skater');
  $('.welcome-header').text('Skate Life, Breh');
});



// MAYBE MOVE THIS TO A MAIN FILE, APP.JS OR SOMETHING
$(document).on('popupafteropen', '.ui-popup', function() {
  $(this).animate({ opacity: 100 });
  $(this).animate({ opacity: 0 }, 1500);
})
