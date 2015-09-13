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

$(document).on('click', '.explore-btn', function (event) {
  event.preventDefault();
  initializeAnonymousUserObject();
  $.mobile.loadPage('#main-map-page');
  $.mobile.changePage('#main-map-page');
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
    $.mobile.loadPage('#main-map-page');
    $.mobile.changePage('#main-map-page');
  })

  .fail(function (response) {
    console.log(response);
  });
}

var initializeUserObject = function(serverData) {
  var userData = JSON.parse(window.localStorage.getItem('googleData')).google;
  userData.position = currentLocation;
  userData.userId = serverData.user.id;
  userData.currentPark = serverData.user.currentPark;
  userData.skateparks = serverData.skateparks;
  userData.name = userData.displayName.split(' ')[0];

  currentUser = new User(userData);
  createUserFirebaseMarker();
}

var initializeAnonymousUserObject = function() {
  var userData = {
    id: Math.floor(Math.random() * 6732) + 8893,
    userId: 0,
    position: currentLocation,
    name: 'Mystery Thrasher',
    profileImageURL: 'https://avatars3.githubusercontent.com/u/10751085?v=3&s=460',
    currentPark: null,
    skateparks: []
  }

  currentUser = new User(userData);
  createUserFirebaseMarker();
}


var createUserFirebaseMarker = function() {
  userMarkerRef.child(currentUser.uid).set({
    url: '#login-page',
    uid: currentUser.uid,
    position: currentUser.position,
    icon: './imgs/other-skaters.png'
  });
}


var signOut = function() {
  localStorage.clear();
  currentUser = null;
  $.mobile.changePage('#login-page');
}




