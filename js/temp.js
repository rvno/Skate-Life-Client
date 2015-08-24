function User(authData, serverData, location) {
  this.userId = serverData.id,
  this.uid = authData.id,
  this.position = location.position,
  this.name = authData.displayName.split(' ')[0],
  this.marker = null,
  this.img = authData.profileImageURL,
  this.favorites = []
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

User.prototype.bindDragListener = function() {
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
  })
}


Skatepark.prototype.buildInfoWindow = function() {
  // ***** Refactor infoWindow content string

  var infoWindow = new google.maps.InfoWindow({
    content: '<p class="park-id" hidden>'+this.id+'</p><p class="center info-w-name">'+this.name+'</p><p class="center info-w-address">'+this.address+'</p><a class="skatepark-link center" href='+baseURL+'api/skateparks/'+this.id+'>check it</a><button class="attend center">Attend</button><p class="center center-img"><img src="https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+this.position.G+','+this.position.K+'&fov=70&heading=235&pitch=0"/></p><p class="skater_count"></p>',
    position: this.position
  });

  return infoWindow;

  // *** May still need this verify if infoWindows work first
  // infoWindow.setPosition(this.lat, this.lon)
}






// var marker = new google.maps.Marker({
//   position: new google.maps.LatLng(lat,lon),
//   title: this.name,
//   map: map,
//   icon: "./imgs/this.png"
// });