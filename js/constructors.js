// DO WE EVEN USER THIS.FAVORITES????

function User(userData) {
  this.uid = userData.id,
  this.userId = userData.userId,
  this.position = userData.position,
  this.name = userData.name,
  this.img = userData.profileImageURL,
  this.marker = null,
  this.currentPark = userData.currentPark,
  this.skateparks = userData.skateparks
}


User.prototype.saveCurrentLocation = function() {
  //this may not work
  currentUser.marker.position = this.marker.position;

  userMarkerRef.child(currentUser.uid).set({
    url: currentUser.marker.url,
    uid: currentUser.uid,
    position: currentUser.marker.position,
    icon: currentUser.marker.icon
  });
}


User.prototype.initializeGeofence = function() {
  var geofence = new google.maps.Circle({
    map: map,
    radius: 9001,
    fillColor: 'EEEBE4',
    fillOpacity: .22,
    strokeColor: '#383838',
    strokeWeight: .35
  });

  geofence.bindTo('center', this.marker, 'position');
  this.geofence = geofence;
}


User.prototype.bindDragListener = function() {
  google.maps.event.addListener(this.marker, 'dragend', this.handleDragListener.bind(this));
  // google.maps.event.addListener(this.marker, 'dragend', this.saveCurrentLocation);
  // google.maps.event.addListener(this.marker, 'dragend', this.populateCarousel.bind(this));
}

User.prototype.handleDragListener = function(){
  this.saveCurrentLocation();
  this.populateCarousel();
  openActiveSkateparkWindow();
}

User.prototype.populateCarousel = function() {
  $('.carousel-element').remove();
  var bounds = this.geofence.getBounds();

  allSkateparks.forEach(function(park){
    if(bounds.contains(park.marker.position)){
      $('.carousel').slick('slickAdd', park.carouselElement)
    }
  }) 
}

// User.prototype.bindDragListener = function() {
//   var user = this;
//   google.maps.event.addListener(this.marker, 'dragend', function(){
//     user.saveCurrentLocation();

    //take the geofence bounds and compare it against the markers here

    // var bounds = user.geofence.getBounds();
    // if(bounds.contains())  
    // allSkateparks.forEach(function(park){
      // if(bounds.contains(park.marker.position)){
        // console.log('we gawt 1')
      // }
    // })  
//   });
// }


// Skateparks should load once and only once, make sure
// that this is happening
function Skatepark(serverData, options) {
  this.id = serverData.id,
  this.name = serverData.name,
  this.address = serverData.address,
  this.position = new google.maps.LatLng(serverData.lat,serverData.lon),
  this.attendees = 0
}


Skatepark.prototype.buildInfoWindow = function() {
  // ***** Refactor infoWindow content string
  var infoWindow = new google.maps.InfoWindow({
    content: '<div class="info-window"><p class="park-id" hidden>'+this.id+'</p><p class="center info-w-name">'+this.name+'</p><p class="center info-w-address">'+this.address+'</p><p class="skater-count center">Skaters Here: <span class="attendee-count">'+this.attendees+'</span></p><a class="skatepark-link" href='+baseURL+'api/skateparks/'+this.id+'><button class="check-park center">Check It</button></a><button class="attend center">Attend</button></div>',
    position: this.position
  });

  return infoWindow;
}

Skatepark.prototype.initializeSkateparkMarker = function() {
  this.marker = new google.maps.Marker({
    position: this.position,
    title: this.name,
    map: map,
    icon: './imgs/new-skatepark-icon.png'
  });

  google.maps.event.addListener(this.marker, 'click', function () {
    this.infoWindow.open(map, this.marker);
  });
}


Skatepark.prototype.incrementAttendees = function() {
  this.attendees++;
  this.refreshAttendees();
}

Skatepark.prototype.decrementAttendees = function() {
  this.attendees--;
  this.refreshAttendees();
}

Skatepark.prototype.refreshAttendees = function() {
  var content = $('p:contains('+this.id+')').parent().children('.skater_count').children();
  content.text(this.attendees);
}