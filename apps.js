"use strict";

// Non-editable data from server
var myList = [
	{"name":"Katana-Ya", "address":"430 Geary St.", "lat":37.787285, "long":-122.410464, "yelpID":"katana-ya-san-francisco", "rating":null},
	{"name":"Izakaya Sozai", "address":"1500 Irving St.", "lat":37.763847, "long":-122.474121, "yelpID":"izakaya-sozai-san-francisco", "rating":null},
	{"name":"Genki Ramen","address": "3944 Geary Blvd.", "lat":37.781361, "long":-122.461898, "yelpID":"genki-ramen-san-francisco", "rating":null},
	{"name":"Tanpopo", "address":"1740 Buchanan St.", "lat":37.786186, "long":-122.429676, "yelpID":"tanpopo-san-francisco", "rating":null},
	{"name":"Suzu Noodle House", "address":"1825 Post St.", "lat":37.784942, "long":-122.432057, "yelpID":"suzu-noodle-house-san-francisco", "rating":null},
	{"name":"Saiwaii Ramen","address": "2240 Irving St.", "lat":37.763520, "long":-122.482179, "yelpID":"saiwaii-ramen-san-francisco-3", "rating":null},
	{"name":"Mifune Restaurant", "address":"1737 Post St.", "lat":37.785325, "long":-122.430269, "yelpID":"mifune-restaurant-san-francisco", "rating":null},
	{"name":"Ajisen Ramen", "address":"865 Market St.", "lat":37.783951, "long":-122.407162, "yelpID":"ajisen-ramen-san-francisco", "rating":null},
	{"name":"Ken Ken Ramen","address": "3378 18th St.", "lat":37.762103, "long":-122.418744, "yelpID":"ken-ken-ramen-san-francisco-2", "rating":null},
	{"name":"Ramen Yamadaya","address": "1728 Buchanan St.", "lat":37.786067, "long":-122.429653, "yelpID":"ramen-yamadaya-san-francisco", "rating":null}
];

// Set up Ajax call to Yelp Business API
var buildYelpURL = function(myList) {
	var ratings = [];
	// Authenticate Yelp v2 API using oAuth2
	var auth = {
		consumerKey: "lZJQmQK1sk6Z0sxlJh0fkQ",
		consumerSecret: "QN8BWuHm7Ebahb6xuW6MVkn8Wfs",
		accessToken: "9Geswp7n67r838vtB4OwyY_fEGmUyCgm",
		accessTokenSecret: "1vzrGIs3U5QPuv1Nu3SXSUUHFJk",
		serviceProvider : {
			signatureMethod : "HMAC-SHA1"
			}
		};

	var accessor = {
		consumerSecret: auth.consumerSecret,
		tokenSecret: auth.accessTokenSecret
		};

	var parameters = [];
	parameters.push(["callback", 'cb']);
	parameters.push(["oauth_consumer_key", auth.consumerKey]);
	parameters.push(["oauth_consumer_secret", auth.consumerSecret]);
	parameters.push(["oauth_token", auth.accessToken]);
	parameters.push(["oauth_signature_method", "HMAC-SHA1"]);

	var message = {
		"action": 'http://api.yelp.com/v2/business/' + myList.yelpID,
		"method": 'GET',
		"parameters" : parameters
	};
	// console.log(message);

	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);

	var parameterMap = OAuth.getParameterMap(message.parameters);
	// console.log(parameterMap);

	$.ajax({
		"url": message.action,
		"data": parameterMap,
		"dataType": "jsonp",
		"cache": true,
		"success": function(data, textStats, XMLHttpRequest) {
			// console.log(XMLHttpRequest.status);
			var phone = "<a href=tel:" + data.display_phone + "></a>";
			var row = $("<tr />");
			$(".table").append(row);
			row.append($("<td>" + myList.name + "</td>"));
			row.append($("<td>" + data.rating + "</td>"));
			row.append($("<td>" + data.review_count + "</td>"));
			row.append($("<td>" + "<a href=tel:" + data.display_phone + ">" + data.display_phone + "</a>" + "</td>"));
		},
		"error": function(XMLHttpRequest) {
			console.log(XMLHttpRequest);
		}
	});
};

// Get Yelp Rating
var getYelpRating = function(myList) {
	// console.log(myList); // myList array
	for (var i = 0, len = myList.length; i < len; i++) {
		// console.log(myList[i]); // object of myList array
		buildYelpURL(myList[i]);
	}
};

// instantiate Ajax call
getYelpRating(myList);


// Knockout ViewModel
var ViewModel = function() {
	var self = this;

	// Get myList data to ViewModel
	var restaurants = ko.observableArray();
	self.restaurants = ko.observableArray(myList);

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
		var lat = self.filteredRestaurants()[i].lat;
		var long = self.filteredRestaurants()[i].long;
		var name = self.filteredRestaurants()[i].name;
		var address = self.filteredRestaurants()[i].address;
		var rating = self.filteredRestaurants()[i].rating;

		var contentString =
			'<div class="container" style="width: 100%">' + 
				'<h4 class="text-uppercase"><strong>' + name + '</strong></h4>' +
				'<p class="text-uppercase"><em>' + address + '</em></p>' +
			'</div>';

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