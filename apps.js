// Knockout Custom Binding for Google Maps
function point(name, lat, long) {
	var self = this;
	self.name = name;
	self.lat = ko.observable(lat);
	self.long = ko.observable(long);

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, long),
		title: name,
		map: map,
		draggable: true
	});

	//if you need the poition while dragging
	google.maps.event.addListener(marker, 'drag', function() {
		var pos = marker.getPosition();
		self.lat(pos.lat());
		self.long(pos.lng());
	}.bind(self));

	//if you just need to update it when the user is done dragging
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

	self.points = ko.observableArray([
		new point('Test1', 37.7833, -122.4167),
		new point('Test2', 37.7843, -122.4167),
		new point('Test3', 37.7833, -122.4177)
	]);

	// Non-editable data from server
	self.Restaurants = ko.observableArray([
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
	]);

	// alert('The length of the array is ' + myLocations().length);
	// alert('The first element is ' + myLocations()[0].name);

	self.location = ko.observable();

	self.searchLocation = ko.computed(function() {
		return self.location;
	}, this);
};

// Initiate KnockoutJS
ko.applyBindings(new ViewModel());