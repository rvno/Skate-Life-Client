function User(options) {
  this.name = options.displayName.split(' ')[0],
  this.uid = options.id,
  this.img = options.profileImageURL
  this.favorites = [];
}



function Skatepark(options) {
  this.name = null
}