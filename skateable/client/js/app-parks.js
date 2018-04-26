/*global $, document, google, ko, theaters, ajax, setTimeout, console, alert, window*/
/*jshint esversion: 6 */
let map;




//Initiliazes  the map, using the center of WA state as the center
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.6062, lng: -122.3321},
        zoom: 12,
        mapTypeControl: false, //Sticks to the classic mapType
        minZoom: 5,
        streetViewControl: false
    });
    ko.applyBindings(new ViewModel());
}


//Class to store each SkateSpot information
let skateSpot = function (skateSpot) {
	this.id = ko.observable(skateSpot.name);
    this.name = ko.observable(skateSpot.name);
    this.lat = ko.observable(skateSpot.position.lat);
    this.lng = ko.observable(skateSpot.position.lng);
    this.id = ko.observable(skateSpot.id);
    this.streetAddress = ko.observable('');
    this.marker = ko.observable();
    this.visible = ko.observable(true);
	this.comments = ko.observableArray();
	this.rating = ko.observable();
};

let ViewModel = function () {
    //Function for sidebar animation
    let self = this;
	favSpots = [];
    
    let panelVis = false,
        sidebar = $('#side-bar'),
        menuButton = $("#menu-button"),
        pinModal = $('#createPin');
    
    self.closePanel = function() {
        sidebar.css("width", "0");
        setTimeout(function() { 
            $('#side-bar .list').css("visibility", "hidden"); 
        }, 200);
        panelVis = false;
    };
    
    self.openPanel = function() {
        sidebar.css("width", "15%");
        setTimeout(function() { $('#side-bar a').css("visibility", "visible"); }, 200);       
        panelVis = true;
    };
	
	
	var filter = "{\"where\":{\"or\":[";
	var filterEnd = "]}}";
	$.each(curUser.favSpots, function(i, value){
		
		filter += "{\"id\":\"" + value + "\"},";
		count++;
	});
	
	filter = filter.replace(/,\s*$/, "");
	filter += filterEnd;
	
	if(count == 1){
		filter = "{\"where\":{\"id\":\"" + curUser.favSpots[0] + "\"}}";
	}
	
	if (count >= 1)
	{
		//for each group the user has, fetch the group information from the db
		AjaxGet("http://localhost:3000/api/skateSpots?filter="+ filter + "&access_token=" + String(curUser.key), function(data){
			//console.log(data);
			
			$.each(data, function(i, value){
				favSpots.push(value);
			});	
			
			//input into group ui list here
			
			//test to create a group status: working
			//createGroup(curUser,groupList);
		});
	}
};