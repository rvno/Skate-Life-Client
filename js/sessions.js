var ref = new Firebase('https://skatelife.firebaseio.com/');
var baseURL = 'https://skate-life-backend.herokuapp.com/';
// var baseURL = 'http://localhost:3000/';
var currentUser;
var userMarkerRef = ref.child('markers');







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


var backendUserAuth = function(authData) {
  var path = baseURL + 'api/users/' + authData.google.id + '/authenticate'

  $.ajax({
    url: path,
    type: 'post',
    data: authData,
    dataType: 'json'
  })

  .done(function (response) {
    initializeUserObject(response);
  })

  .fail(function (response) {
    console.log(response);
  });
}

var initializeUserObject = function(serverData) {
  var userData = JSON.parse(window.localStorage.getItem('googleData'));
  var location = {position: currentLocation}
  currentUser = new User(userData.google, serverData, location);

  createUserFirebaseMarker();
}


var createUserFirebaseMarker = function() {
  userMarkerRef.child(currentUser.uid).set({
    url: '#login-page',
    uid: currentUser.uid,
    position: currentUser.position,
    icon: './imgs/user.png'
  });
}


var signOut = function() {
  localStorage.clear();
  currentUser = null;
  $.mobile.changePage('#login-page');
}




