function User(authData, serverData) {
  this.userId = serverData.id,
  this.uid = authData.id,
  this.name = authData.displayName.split(' ')[0],
  this.img = authData.profileImageURL
  this.favorites = [];
}



function Skatepark(options) {
  this.name = null
}