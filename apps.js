// Non-editable data from server
var myList = [
	{"name":"Katana-Ya", "address":"430 Geary St.", "lat":37.787285, "long":-122.410464, "yelpID":"katana-ya-san-francisco"},
	{"name":"Izakaya Sozai", "address":"1500 Irving St.", "lat":37.763847, "long":-122.474121, "yelpID":"izakaya-sozai-san-francisco"},
	{"name":"Genki Ramen","address": "3944 Geary Blvd.", "lat":37.781361, "long":-122.461898, "yelpID":"genki-ramen-san-francisco"},
	{"name":"Tanpopo", "address":"1740 Buchanan St.", "lat":37.786186, "long":-122.429676, "yelpID":"tanpopo-san-francisco"},
	{"name":"Suzu Noodle House", "address":"1825 Post St.", "lat":37.784942, "long":-122.432057, "yelpID":"suzu-noodle-house-san-francisco"},
	{"name":"Saiwaii Ramen","address": "2240 Irving St.", "lat":37.763520, "long":-122.482179, "yelpID":"saiwaii-ramen-san-francisco-3"},
	{"name":"Mifune Restaurant", "address":"1737 Post St.", "lat":37.785325, "long":-122.430269, "yelpID":"mifune-restaurant-san-francisco"},
	{"name":"Ajisen Ramen", "address":"865 Market St.", "lat":37.783951, "long":-122.407162, "yelpID":"ajisen-ramen-san-francisco"},
	{"name":"Ken Ken Ramen","address": "3378 18th St.", "lat":37.762103, "long":-122.418744, "yelpID":"ken-ken-ramen-san-francisco-2"},
	{"name":"Ramen Yamadaya","address": "1728 Buchanan St.", "lat":37.786067, "long":-122.429653, "yelpID":"ramen-yamadaya-san-francisco"}
];





            var auth = {
                //
                // Update with your auth tokens.
                //
                consumerKey : "lZJQmQK1sk6Z0sxlJh0fkQ",
                consumerSecret : "QN8BWuHm7Ebahb6xuW6MVkn8Wfs",
                accessToken : "9Geswp7n67r838vtB4OwyY_fEGmUyCgm",
                // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
                // You wouldn't actually want to expose your access token secret like this in a real application.
                accessTokenSecret : "1vzrGIs3U5QPuv1Nu3SXSUUHFJk",
                serviceProvider : {
                    signatureMethod : "HMAC-SHA1"
                }
            };

            var terms = 'food';
            var near = 'San+Francisco';

            var accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
            };
            parameters = [];
            parameters.push(['term', terms]);
            parameters.push(['location', near]);
            parameters.push(['callback', 'cb']);
            parameters.push(['oauth_consumer_key', auth.consumerKey]);
            parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
            parameters.push(['oauth_token', auth.accessToken]);
            parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

            var message = {
                'action' : 'http://api.yelp.com/v2/search',
                'method' : 'GET',
                'parameters' : parameters
            };
            console.log(message);

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, accessor);

            var parameterMap = OAuth.getParameterMap(message.parameters);
            console.log(parameterMap);

            $.ajax({
                'url' : message.action,
                'data' : parameterMap,
                'dataType' : 'jsonp',
                'jsonpCallback' : 'cb',
                'cache': true,
                'success' : function(data, textStats, XMLHttpRequest) {
                    console.log(data);
                    //$("body").append(output);
                }
            });






// Knockout ViewModel
var ViewModel = function() {
	var self = this;

	// Get myList data to ViewModel
	var restaurants = ko.observableArray();
	self.restaurants = ko.observableArray(myList);
	// console.log(self.restaurants()[0].name); // result: "Katana-Ya"
	// console.log(self.restaurants().length); // result: 10

	self.query = ko.observable("");

	self.filteredRestaurants = ko.computed(function() {
		var query = self.query().toLowerCase();
		if (!query) {
			return self.restaurants();
		} else {
			// console.log(query);
			return ko.utils.arrayFilter(self.restaurants(), function(item) {
				// console.log(item.name);
				var shownList = item.name.toLowerCase().indexOf(query) !== -1 || item.address.toLowerCase().indexOf(query) !== -1;
				return shownList;
			});
		}
	});

	// Create marker from each restaurant's lat & long
	for (var i = 0; i < self.filteredRestaurants().length; i++) {
		lat = self.filteredRestaurants()[i].lat;
		long = self.filteredRestaurants()[i].long;
		name = self.filteredRestaurants()[i].name;
		address = self.filteredRestaurants()[i].address;
		// bizLink = "http://www.yelp.com/biz/" + self.filteredRestaurants()[i].yelpID;
		// console.log(bizLink);

		contentString =
			'<div class="container" style="width: 100%">' + 
				'<h4 class="text-uppercase"><strong>' + name + '</strong></h4>' +
				'<p class="text-uppercase"><em>' + address + '</em></p>' +
			'</div>';

		// '<div class="container" style="width:400px">' + name + '</div>' + '</br>' + address;

		// start Google Map marker
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, long),
			map: map,
			animation: google.maps.Animation.DROP,
			clickable: true,
			textWindow: contentString
		});

		var infowindow = new google.maps.InfoWindow({});

		google.maps.event.addListener(marker, 'mouseover', function(){
			infowindow.setContent(this.textWindow); 
			infowindow.open(map,this);
		});

		marker.setMap(map); 
	}

};

// Render Google Maps to HTML page
var map = new google.maps.Map(document.getElementById('map-canvas'), {
	zoom: 13,
	center: new google.maps.LatLng(37.7833, -122.4357),
	mapTypeId: google.maps.MapTypeId.ROADMAP
});

// Initiate KnockoutJS
ko.applyBindings(new ViewModel());