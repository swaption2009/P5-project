// Non-editable data from server
var myList = [
	{"name":"Katana-Ya", "address":"430 Geary St.", "lat":"37.787285", "long":"-122.410464"},
	{"name":"Izakaya Sozai", "address":"1500 Irving St.", "lat":"37.763847", "long":"-122.474121"},
	{"name":"Genki Ramen","address": "3944 Geary Blvd.", "lat":"37.781361", "long":"-122.461898"},
	{"name":"Tanpopo", "address":"1740 Buchanan St.", "lat":"37.786186", "long":"-122.429676"},
	{"name":"Suzu Noodle House", "address":"1825 Post St.", "lat":"37.784942", "long":"-122.432057"},
	{"name":"Saiwaii Ramen","address": "2240 Irving St.", "lat":"37.763520", "long":"-122.482179"},
	{"name":"Mifune Restaurant", "address":"1737 Post St.", "lat":"37.785325", "long":"-122.430269"},
	{"name":"Ajizen Ramen", "address":"865 Market St.", "lat":"37.783951", "long":"-122.407162"},
	{"name":"Ken Ken Ramen","address": "3378 18th St.", "lat":"37.762103", "long":"-122.418744"},
	{"name":"Ramen Yamadaya","address": "1728 Buchanan St.", "lat":"37.786067", "long":"-122.429653"}
];

// Restaurant model for Google Maps JS API
function restaurant(myList) {
	var self = this;
	self.name = myList.name;
	self.address = myList.address;
	self.lat = myList.ko.observable(lat);
	self.long = myList.ko.observable(long);

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, long),
		title: name,
		map: map,
		draggable: true
	});

	//Make maps dragable
	google.maps.event.addListener(marker, 'drag', function() {
		var pos = marker.getPosition();
		self.lat(pos.lat());
		self.long(pos.lng());
	}.bind(self));

	//Update maps when the user is done dragging
	google.maps.event.addListener(marker, 'dragend', function() {
		var pos = marker.getPosition();
		self.lat(pos.lat());
		self.long(pos.lng());
	}.bind(self));
}

var map = new google.maps.Map(document.getElementById('map-canvas'), {
	zoom: 13,
	center: new google.maps.LatLng(37.7833, -122.4167),
	mapTypeId: google.maps.MapTypeId.ROADMAP
});


// Knockout ViewModel
var ViewModel = function() {
	var self = this;

	// Preliminary data
	var restaurants = ko.observableArray();
	self.restaurants = ko.observableArray(myList);
	console.log(restaurants[0]);

	// Preliminary data
	// self.restaurants = ko.observableArray([
	// 	new restaurant("Katana-Ya", "430 Geary St.", 37.787285, -122.410464),
	// 	new restaurant("Izakaya Sozai", "1500 Irving St.", 37.763847, -122.474121),
	// 	new restaurant("Genki Ramen", "3944 Geary Blvd.", 37.781361, -122.461898),
	// 	new restaurant("Tanpopo", "1740 Buchanan St.", 37.786186, -122.429676),
	// 	new restaurant("Suzu Noodle House", "1825 Post St.", 37.784942, -122.432057),
	// 	new restaurant("Saiwaii Ramen", "2240 Irving St.", 37.763520, -122.482179),
	// 	new restaurant("Mifune Restaurant", "1737 Post St.", 37.785325, -122.430269),
	// 	new restaurant("Ajizen Ramen", "865 Market St.", 37.783951, -122.407162),
	// 	new restaurant("Ken Ken Ramen", "3378 18th St.", 37.762103, -122.418744),
	// 	new restaurant("Ramen Yamadaya", "1728 Buchanan St.", 37.786067, -122.429653)
	// ]);

	self.location = ko.observable();

	self.searchLocation = ko.computed(function() {
		return self.location;
	}, this);
};

// Initiate KnockoutJS
ko.applyBindings(new ViewModel());