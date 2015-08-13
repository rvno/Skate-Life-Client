var userData;
var lastMessage;
var lastSkatepark;



$( document ).on( "pageshow", "#main-map-page", function( event ) {
  userData = JSON.parse(window.localStorage.getItem('googleData'))
});






// SkatePark Show Page
$(document).on("click", ".skatepark-link", function(event){
  event.preventDefault();
  var path = event.target.href
  var skatepark = event.target.text

  if (skatepark !== lastSkatepark) {
    clearChat();
  }


  $.ajax({
    url: path,
    method: 'get',
    dataType: 'json'
  })

  .done(function(response){
    initializeChatroom(skatepark);

    buildSkateparkPage(response)
    $.mobile.changePage('#skatepark-page');
  })

  .fail(function(response){
    console.log("failure")
  });
});



var initializeChatroom = function(skatepark) {
  var skateparkURL = skatepark.split(' ')[0];
  var messageRef = new Firebase('https://skatelife.firebaseio.com/parkchats/' + skatepark);
  // userData = JSON.parse(window.localStorage.getItem('googleData'));
  if (userData) {
    var firstName = userData.google.displayName.split(' ')[0];
  } else {
    var firstName = 'Mystery Thrasher';
  }

  $('.chat-user').text(firstName);

  messageRef.on('child_added', function (snapshot){
    var message = snapshot.val();

    if (message.text !== lastMessage && message !== '') {
      $('.messages-div').append(
        $('<div>').addClass('message').append(
          $('<img>').addClass('user-profile-img').attr('src', message.avatarURL),
          $('<p>').text(message.name + ': ' + message.text)));
    }

    lastMessage = message.text
    lastSkatepark = skatepark
  });




  $('#message-submit').on('click', function (event) {

    event.preventDefault();


    // var name = $('#name-input').val();
    // var avatarURL = $('.user-profile-img').attr('src');
    if (userData) {
      var avatarURL = userData.google.profileImageURL;
    } else {
      var avatarURL = './imgs/johnny_hash.jpg';
    }

    var name = $('.chat-user').text();
    var message = $('#message-input').val();

    if (message !== lastMessage && message !== '') {
      messageRef.push({
        name: name, 
        text: message, 
        avatarURL: avatarURL});

      $('#message-input').val('');
    }

  });

}


var clearChat = function() {
  $('.messages-div').empty();
}


var buildSkateparkPage = function(skatepark) {
  $('#skatepark-page .skatepark-name').text(skatepark.name.toUpperCase());
  var skateparkDiv =
    $('<div>').append(
      $('<h1>').text(skatepark.name),
      $('<p>').addClass('bold').text('Address: ' + skatepark.address),
      $('<p>').text('This spot has been favorited a whopping ' + skatepark.fav_count + ' times braski'),
      $('<img >').attr('src', 'https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+skatepark.lat+','+skatepark.lon+'&fov=70&heading=235&pitch=0'),
      $('<p>')
        .addClass('skatepark-id')
        .text(skatepark.id)
        .hide());

  $('#skatepark-page .ui-content .skatepark-page').html(skateparkDiv);
}