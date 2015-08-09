baseURL = 'https://skate-life-backend.herokuapp.com/';
$(document).on("pageinit", '#main-map-page',function(){
	// alert("the next page is loading");
	console.log(baseURL);
	var path = baseURL + 'api/skateparks/';
	$.ajax({
		url: path,
		method: 'get',
		dataType: 'json'
	})
	.done(function(response){
		console.log('done')
		$.each(response, function(index, skatepark){
			$('.skateparks').append(
				$('<li>').append(
					$('<a>')
						.addClass('skatepark-link')
						.attr('href', path+ skatepark.id)
						// .attr('id', park.name)
						.text(skatepark.name)));

		})
	})
	.fail(function(response){
		console.log('fail')
	})

});


$(document).on("click", ".skatepark-link", function(e){
	e.preventDefault();
	// $('#skatepark-page .ui-content .skatepark-page').text('supppp')
	console.log(e.target.href)
	var path = e.target.href
	$.ajax({
		url: path,
		method: 'get',
		dataType: 'json'
	})
	.done(function(response){
		console.log(response)
		if(response.name.includes("skatepark")){
			response.name
		}
		else{
			response.name = response.name + " skatepark"
		}

		$('#skatepark-page .skatepark-name').text(response.name)
		$('#skatepark-page .ui-content .skatepark-page').html('<h1>'+response.name+'</h1><p>Address: '+response.address+'</p><p>Favorited: '+response.fav_count+'</p>'
			)

		// text(response.name + response.address + response.fav_count)
		// window.location.replace('#skatepark-page')
		$.mobile.changePage('#skatepark-page');
	})
	.fail(function(response){
		console.log("failure")
	})
	// window.location.replace('#skatepark-page')
})

$(document).ready(function(){
	$('.login-btn').on('click', function(e){
		console.log("something funny")
	})
})