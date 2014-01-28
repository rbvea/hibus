var buses = {};
var map;

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(21.310326, -157.857914),
    zoom: 15,
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
      
var vehicles = new Firebase("https://hawaii-firebus.firebaseio.com/vehicle");
var trip = new Firebase("https://hawaii-firebus.firebaseio.com/trip");

function newBus(bus, firebaseId) {
    var busLatLng = new google.maps.LatLng(bus.lat, bus.lng);
    if(_.isString(bus.trip) && bus.trip != 'null_trip') {
      var route = bus.trip.replace(/\./g, "_");
      trip.child(route).on('value', function(routeData){
        var routeDisplay = routeData.val().number;
        var marker = new google.maps.Marker({icon: 'http://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=bus|bb|'+routeDisplay+'|FFF|000', position: busLatLng, map: map });
        buses[firebaseId] = marker;
      });
    }
}

vehicles.once("value", function(s) {
  s.forEach(function(b) {
    newBus(b.val(), b.name());
  });
});

vehicles.on("child_changed", function(s) {
  var busMarker = buses[s.name()];
  if(typeof busMarker === 'undefined') {
    newBus(s.val(), s.name());
  }
  else {
    busMarker.animatedMoveTo(s.val().lat, s.val().lng);
  }
});

vehicles.on("child_removed", function(s) {
  var busMarker = buses[s.name()];
  if(typeof busMarker !== 'undefined') {
    busMarker.setMap(null);
    delete buses[s.name()];
  }
});
