$('.carousel').slick({
  arrows: false,
  focusOnSelect: true,
  mobileFirst: true,
  slidesToShow: 1,
  slidesToScroll: 1,
});

//upon moving the marker position, check the boundaries of the marker against the position of the markers
//if the marker is within that position, we populate the carousel with the names of those skateparks


var buildCarouselElement = function(skatepark){
	//
	var parkCarouselElement = 
		$('<div>').addClass('carousel-element').append(
			$('<p>').text(skatepark.name).attr('id', skatepark.id)
			) 

	skatepark.carouselElement = parkCarouselElement

}