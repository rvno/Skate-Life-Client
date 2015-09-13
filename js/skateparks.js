var messageRef;
var allSkateparks = [];
var currentPark;



$(document).on('pageshow', '#main-map-page', function (event, ui) {
  bindSkateparkPageListener();
});

$(document).on('pagehide', '#skatepark-page', function (event, ui){
  unBindSkateparkLinkListener();
});


var bindSkateparkPageListener = function() {
  $(document).on('click', '.skatepark-link', function (event) {
    clearChat();
    unBindChatroomListener();

    event.preventDefault();
    var path = event.target.href;

    var parkId = $(this).siblings('p:first-child').text();

    allSkateparks.forEach(function (skatepark) {
      if (skatepark.id == parkId) {
        buildSkateparkPage(skatepark);
        return currentPark = skatepark;
      }
    });

    initializeChatroom(currentPark);
    $.mobile.changePage('#skatepark-page');
  });

  console.log('events bound');
}


var unBindSkateparkLinkListener = function() {
  $(document).off('click', '.skatepark-link');
  console.log('events unbound');
}

var unBindChatroomListener = function() {
  $('#message-submit').off('click');
  if (messageRef) messageRef.off('child_added');
}


var initializeChatroom = function(skatepark) {
  var skateparkURL = skatepark.name.split(' ')[0];
  messageRef = new Firebase('https://skatelife.firebaseio.com/parkchats/' + skateparkURL);

  if (currentUser) {
    var firstName = currentUser.name;
  } else {
    var firstName = 'Mystery Thrasher';
  }

  $('.chat-user').text(firstName);
  messageRef.on('child_added', function (snapshot){
    var message = snapshot.val();
    $('.messages-div').append(
      $('<div>').addClass('message').append(
        $('<div>').addClass('user-profile-container').append(
        $('<img>').addClass('user-profile-img').attr('src', message.avatarURL)),
        $('<div>').addClass('message-content-container').append(
          $('<p>').addClass('message-content').text(message.name + ': ' + message.text))
        ));
  });

  bindMessageSubmitListener();

}


var bindMessageSubmitListener = function() {
  $('#message-submit').on('click', function (event) {
    event.preventDefault();

    if (currentUser) {
      var avatarURL = currentUser.img;
    } else {
      var avatarURL = 'https://avatars3.githubusercontent.com/u/10751085?v=3&s=460';
    }

    var name = $('.chat-user').text();
    var message = $('#message-input').val();

  
      messageRef.push({
        name: name,
        text: message,
        avatarURL: avatarURL});

      $('#message-input').val('');
  });
}


var clearChat = function() {
  $('.messages-div').empty();
}


var buildSkateparkPage = function(skatepark) {
  $('#skatepark-page .skatepark-name').text(skatepark.name.toUpperCase());

  if (skatepark.favCount === 1)
    var favCountString = 'This park has been Fav\'d '+skatepark.favCount+' time!';
  else
    var favCountString = 'This park has been Fav\'d '+skatepark.favCount+' times!';

  var skateparkDiv =
    $('<div>').append(
      $('<h1>').text(skatepark.name),
      $('<p>').addClass('bold').text('Address: ' + skatepark.address),
      $('<p>').addClass('fav-count').text(favCountString),
      $('<p>')
        .addClass('skatepark-id')
        .text(skatepark.id)
        .hide());

  $('#skatepark-page .ui-content .skatepark-page').html(skateparkDiv);
}

