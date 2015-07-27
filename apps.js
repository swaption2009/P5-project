// Here's my data model
var ViewModel = function(location) {
	this.location = ko.observable(location);

	this.allLocation = ko.computed(function() {
		return this.location;
	}, this);
};

// Initiate KnockoutJS
ko.applyBindings(new ViewModel("Union Square, San Francisco"));