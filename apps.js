// Knockout Custom Binding for Google Maps
function point(name, lat, long) {
    this.name = name;
    this.lat = ko.observable(lat);
    this.long = ko.observable(long);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        title: name,
        map: map,
        draggable: true
    });

    //if you need the poition while dragging
    google.maps.event.addListener(marker, 'drag', function() {
        var pos = marker.getPosition();
        this.lat(pos.lat());
        this.long(pos.lng());
    }.bind(this));

    //if you just need to update it when the user is done dragging
    google.maps.event.addListener(marker, 'dragend', function() {
        var pos = marker.getPosition();
        this.lat(pos.lat());
        this.long(pos.lng());
    }.bind(this));
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
		{"name":"Katana-Ya", "address":"430 Geary St, San Francisco, CA 94102"},
		{"name":"Izakaya Sozai", "address":"1500 Irving St, San Francisco, CA 94122"},
		{"name":"Genki Ramen","address": "3944 Geary Blvd, San Francisco, CA 94118"},
		{"name":"Tanpopo", "address":"1740 Buchanan St, San Francisco, CA 94115"},
		{"name":"Suzu Noodle House", "address":"1825 Post St, San Francisco, CA 94115"},
		{"name":"Saiwaii Ramen","address": "2240 Irving St, San Francisco, CA 94122"},
		{"name":"Mifune Restaurant", "address":"1737 Post St, San Francisco, CA 94115"},
		{"name":"Ajizen Ramen", "address":"865 Market St, San Francisco, CA 94103"},
		{"name":"Ken Ken Ramen","address": "3378 18th St, San Francisco, CA 94110"},
		{"name":"Ramen Yamadaya","address": "1728 Buchanan St, San Francisco, CA 94115"}
	]);

	// alert('The length of the array is ' + myLocations().length);
	// alert('The first element is ' + myLocations()[0].name);

	self.location = ko.observable();

	this.showLocations = ko.computed(function() {
		return this.location;
	}, this);
};

// Initiate KnockoutJS
ko.applyBindings(new ViewModel());