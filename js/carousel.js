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
			$('<p>').addClass('center').text(skatepark.name)
			) 

	skatepark.carouselElement = parkCarouselElement

}

var openActiveSkateparkWindow = function(){
	var parkId = $('.slick-active').attr('id')
	allSkateparks.forEach(function(park){
		park.infoWindow.close(map)
		if(park.id === parseInt(parkId)){
			park.infoWindow.open(map);
		}
	})
}
		


$('.carousel').on('afterChange', function(){
	openActiveSkateparkWindow();
})