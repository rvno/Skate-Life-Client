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
  removeUserMarker();
  signOut();
});

// Remove userMarker when user leaves
$(window).on('beforeunload', function () {
  removeUserMarker();
});





function authenticateUserOnLogin() {
  googleOauth().then(function(authData) {
    window.localStorage.setItem(
      'googleData',
      JSON.stringify(authData));

    backendUserAuth(authData);
  });
}


function googleOauth() {
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


function backendUserAuth(authData) {
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

function initializeUserObject(serverData) {
  var userData = JSON.parse(window.localStorage.getItem('googleData')).google;
  userData.position = currentLocation;
  userData.userId = serverData.user.id;
  userData.currentPark = serverData.user.currentPark;
  userData.skateparks = serverData.skateparks;
  userData.name = userData.displayName.split(' ')[0];

  currentUser = new User(userData);
  createUserFirebaseMarker();
}

function initializeAnonymousUserObject() {
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


function createUserFirebaseMarker() {
  userMarkerRef.child(currentUser.uid).set({
    url: '#login-page',
    uid: currentUser.uid,
    position: currentUser.position,
    icon: './imgs/other-skaters.png'
  });
}


function signOut() {
  localStorage.clear();
  map = null;
  currentUser = null;
  $.mobile.changePage('#login-page');
}

function removeUserMarker() {
  userMarkerRef.child(currentUser.uid).remove();
}



