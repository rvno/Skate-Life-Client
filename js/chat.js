// Get a reference to the root of the chat data.
var messagesRef = new Firebase('https://skatelife.firebaseio.com/parkchats/');

$('body').on('click', '.skatepark-link', function(event) {
  var skateparkName = event.target.text
  messagesRef = new Firebase('https://skatelife.firebaseio.com/parkchats/' + skateparkName)
 
  messagesRef.on('child_added', function (snapshot) {
    var message = snapshot.val();

    $('#messagesDiv').append(
      $('<div>').append(
        $('<p>').text(message.name + ': '),
        $('<p>').text(message.text)))

    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
  });

});


$('#message-form').on('submit', function (event) {
  event.preventDefault();
  var name = $('#nameInput').val();
  var text = $('#messageInput').val();

  messagesRef.push({name: name, text: text});
  $('#messageInput').val();
});



  // var messagesRef = new Firebase('https://chat-example.firebaseio-demo.com/');

  // // When the user presses enter on the message input, write the message to firebase.
  // $('#messageInput').keypress(function (e) {
  //   if (e.keyCode == 13) {
  //     var name = $('#nameInput').val();
  //     var text = $('#messageInput').val();
  //     messagesRef.push({name:name, text:text});
  //     $('#messageInput').val('');
  //   }
  // });

  // // Add a callback that is triggered for each chat message.
  // messagesRef.on('child_added', function (snapshot) {
  //   var message = snapshot.val();
  //   $('<div/>').text(message.text).prepend($('<em/>').text(message.name+': ')).appendTo($('#messagesDiv'));
  //   $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
  // });