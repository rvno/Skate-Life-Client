$('.carousel').slick({
  arrows: false,
  focusOnSelect: true,
  mobileFirst: true,
  slidesToShow: 1,
  slidesToScroll: 1,
});

//upon moving the marker position, check the boundaries of the marker against the position of the markers
//if the marker is within that position, we populate the carousel with the names of those skateparks
//


var buildCarouselElement = function(skatepark){
	//
	var parkCarouselElement = 
		$('<div>').addClass('carousel-element').attr('id', skatepark.id).append(
			$('<p>').text(skatepark.name)
			) 

	skatepark.carouselElement = parkCarouselElement

}

$('.carousel').on('afterChange', function(){
	var parkId = $('.slick-active').attr('id')
	allSkateparks.forEach(function(park){
		park.infoWindow.close(map)
		if(park.id === parseInt(parkId)){
			park.infoWindow.open(map);
		}
	})	
})

// $('.carousel').on('afterChange', function(){
//   imageSrc = $('.slick-active > img').attr('src')
//   parkLocation = grabLocationFromURL(imageSrc)
//   console.log(parkLocation)
//   newMarkerLat = parkLocation.lat
//   newMarkerLong = parkLocation.lon
//   console.log(newMarkerLat)
//   console.log(newMarkerLong)
//   newCenterPoint = {lat: newMarkerLat,lng: newMarkerLong}
//   map.panTo(newCenterPoint)
//   //OPEN INFO WINDOW UPON CAROUSEL SCROLL, time permitting, try to close window when scrolling
//   $.each(infoWindows, function(index, infoWindow){
//     if(infoWindow.position['G'] === newCenterPoint['lat'] && infoWindow.position['K'] === newCenterPoint['lng']){
//       console.log('gotemmmm')
//       previousWindow = infoWindow;
//       infoWindow.open(map);
//     } 
//   })
// })