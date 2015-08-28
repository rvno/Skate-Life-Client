function User(authData, serverData, location) {
  this.userId = serverData.user.id,
  this.uid = authData.id,
  this.position = location.position,
  this.name = authData.displayName.split(' ')[0],
  this.marker = null,
  this.img = authData.profileImageURL,
  this.favorites = [],
  this.currentPark = serverData.user.currentPark,
  this.skateparks = serverData.skateparks
}


User.prototype.saveCurrentLocation = function() {
  currentUser.marker.position = this.position;

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
    fillColor: '#336688',
    fillOpacity: .22,
    strokeColor: '#D48817',
    strokeWeight: 1.75
  });

  geofence.bindTo('center', this.marker, 'position');
}


User.prototype.bindDragListener = function() {
  google.maps.event.addListener(this.marker, 'dragend', this.saveCurrentLocation);
}





// USE PROTOTYPICAL INHERITANCE HERE
function AnonymousUser(options) {
  this.userId = 0,
  this.uid = options.uid,
  this.position = options.position,
  this.name = 'Anonymous Thrasher',
  this.marker = null,
  this.img = '../imgs/johnny_hash.jpg',
  this.favorites = [],
  this.currentPark = null,
  this.skateparks = []
}


AnonymousUser.prototype.saveCurrentLocation = function() {
  currentUser.marker.position = this.position;

  userMarkerRef.child(currentUser.uid).set({
    url: currentUser.marker.url,
    uid: currentUser.uid,
    position: currentUser.marker.position,
    icon: currentUser.marker.icon
  });
}


AnonymousUser.prototype.initializeGeofence = function() {
  var geofence = new google.maps.Circle({
    map: map,
    radius: 9001,
    fillColor: '#336688',
    fillOpacity: .22,
    strokeColor: '#D48817',
    strokeWeight: 1.75
  });

  geofence.bindTo('center', this.marker, 'position');
}


AnonymousUser.prototype.bindDragListener = function() {
  google.maps.event.addListener(this.marker, 'dragend', this.saveCurrentLocation);
}







// Skateparks should load once and only once, make sure
// that this is happening
function Skatepark(serverData, options) {
  this.id = serverData.id,
  this.name = serverData.name,
  this.address = serverData.address,
  this.position = new google.maps.LatLng(serverData.lat,serverData.lon),
  this.marker = new google.maps.Marker({
    position: this.position,
    title: this.name,
    map: map,
    icon: './imgs/skatepark.png'
  }),
  this.attendees = 0
}


Skatepark.prototype.buildInfoWindow = function() {
  // ***** Refactor infoWindow content string
  var infoWindow = new google.maps.InfoWindow({
    content: '<p class="park-id" hidden>'+this.id+'</p><p class="center info-w-name">'+this.name+'</p><p class="center info-w-address">'+this.address+'</p><a class="skatepark-link center" href='+baseURL+'api/skateparks/'+this.id+'>check it</a><button class="attend center">Attend</button><p class="center center-img"><img src="https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+this.position.G+','+this.position.K+'&fov=70&heading=235&pitch=0"/></p><p class="skater_count">Skaters Here: <span class="attendee-count">'+this.attendees+'</span></p>',
    position: this.position
  });

  return infoWindow;
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