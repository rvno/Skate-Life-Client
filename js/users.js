// MOVE THIS TO APP.JS, or LAYOUT.JS?
var externalPanel = '<div data-role="panel" id="favoritesPanel" data-display="overlay" data-theme="b"><a href="#" data-rel="close" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left" data-prefetch >Close Favorites</a><ul data-role="listview" class="favorites"><li id="logout"><a href="#">Logout</a></li></ul></div>';
var chatPanel = '<div data-role="panel" id="chatPanel" data-display="overlay" data-position="right" data-theme="b"><a href="#" data-rel="close" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-right" data-prefetch >Close Messages</a><ul data-role="listview" class="chat-messages"></ul></div>';



// Load up Favs and Chat panel, also populate userData
$(document).on('pagebeforecreate', function () {
  $.mobile.pageContainer.children('#favoritesPanel').remove();
  $.mobile.pageContainer.prepend(externalPanel);
  $('#favoritesPanel').panel().enhanceWithin();

  $.mobile.pageContainer.children('#chatPanel').remove();
  $.mobile.pageContainer.prepend(chatPanel);
  $('#chatPanel').panel().enhanceWithin();
});

$(document).on('click', '.attend', function (event) {
  checkAttendance(this, true);
});

$(document).on('click', '.leave', function (event) {
  checkAttendance(this, false);
});

$(document).on('click', '.favorite-button', function (event) {
  event.preventDefault();
  checkIfFavorited();
});

$(document).on('popupafteropen', '.ui-popup', function() {
  $(this).animate({ opacity: 100 });
  $(this).animate({ opacity: 0 }, 1500);
});


$(document).on('panelbeforeopen', '#favoritesPanel', function (event, ui) {
  if (currentUser) {
    populateFavorites(currentUser.skateparks);
  } else {
    emptyFavorites();
  }
});





// FIX THIS LATER

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



var checkIfFavorited = function() {
  var match;

  if (currentUser) {
    currentUser.skateparks.forEach(function (skatepark) {
      if (skatepark.id === currentPark.id) {
        $('#favoritePopup p').text('This skatepark has already been favorited.');
        $('#favoritePopup').popup('open');
        match = true;
      }
    });

    if (!match) {
      var path = baseURL+'api/users/'+currentUser.userId+'/favorites/'+currentPark.id;

      $.ajax({
        url: path,
        method: 'post'
      })

      .done(function (response) {
        currentUser.skateparks.push(currentPark);
        $('#favoritePopup p').text('Added to your favorites!');
        $('#favoritePopup').popup('open');
      })

      .fail(function (response) {
        console.log(response);
      })
    }

  } else {
    $('#favoriteErrorPopup').popup('open');
  }
}



var populateFavorites = function(favData) {
  $('.favorites').empty();
  $('.favorites').prepend(
    $('<li>').attr('id', 'logout').append(
      $('<a>').attr('href', '#').text('Logout')));

  $.each(favData, function(index, favorite){
    var hiddenID = '<p class="park-id">'+favorite.id+'</p>';

    $('.favorites').append(
      $('<li>').append(
        $(hiddenID).hide(),
        $('<a>')
          .attr('href', baseURL + 'api/skateparks/' + favorite.id)
          .addClass('skatepark-link')
          .text(favorite.name)));
  });


  $('.favorites').listview('refresh')
  $('#logout > a').removeClass('ui-btn-icon-right ui-icon-carat-r')
};



var emptyFavorites = function() {
  $('.favorites').empty();
  $('.favorites').append($('<li>').text('Login to see your favorites.'));

  $('.favorites').prepend(
      $('<li>').attr('id', 'logout').append(
      $('<a>').attr('href', '#').text('Login')));

  $('.favorites').listview('refresh');
  $('#logout > a').removeClass('ui-btn-icon-right ui-icon-carat-r');
}



var checkAttendance = function (target, attending) {
  var button = target;
  var parkId = $(button).siblings('p:first-child').text();

  // FIND SKATEPARK BY ID, PULL THIS OUT INTO FUNCTION
  allSkateparks.forEach(function (skatepark) {
    if (parkId == skatepark.id) return currentPark = skatepark;
  });

  var path = baseURL+'api/users/'+currentUser.userId+'/skateparks/'+parkId;

  toggleAttendance(button, path, attending);
}


var toggleAttendance = function (target, path, attending) {
  if (attending) {
    var method = 'post';
  } else {
    var method = 'delete';
  }

  $.ajax({
    url: path,
    type: method
  })

  .done(function (response) {
    if (attending) {
      $(target).toggleClass('attend leave').text('Leave');
      currentPark.incrementAttendees();
    } else {
      $(target).toggleClass('leave attend').text('Attend');
      currentPark.decrementAttendees();
    }
  })

  .fail(function (response) {
    if (attending) {
      alert('U GOTTA LOG IN BRASKI');
    } else {
      console.log(response);
    }
  });
}




var getSkaters = function(skateparkId) {
  var path = baseURL + 'api/skateparks/' + skateparkId + '/attendees';

  $.ajax({
    url: path,
    type: 'get',
    dataType: 'json'
  })

  .done(function (response) {
    var park = $('.park-id:contains('+skateparkId+')');
    park.siblings('.skater_count').text('Current Skaters: ' + response.length);
  })

  .fail(function (response) {
    console.log(response);
  });
}

