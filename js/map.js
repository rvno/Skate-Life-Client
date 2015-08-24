var map;


// Figure out a way to optimize this, so that you
// don't see "Skater" before the name changes.
$(document).on('pageshow', '#login-page', function () {
  setHeader('.welcome-header');
});


// May not need event and data
$(document).on('pageshow', '#main-map-page', function (event, data) {
  setHeader('.username');
});







var setHeader = function(header) {
  if (currentUser) {
    $(header).text('Welcome ' + currentUser.name);
  } else {
    $(header).text('Welcome Skater');
  }
}

