var buses = {};
var map;

function initialize() {
  console.log('init');
  var mapOptions = {
    center: new google.maps.LatLng(21.310326, -157.857914),
    zoom: 15,
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
      
var vehicles = new Firebase("https://hawaii-firebus.firebaseio.com/vehicle");

function newBus(bus, firebaseId) {
    var busLatLng = new google.maps.LatLng(bus.lat, bus.lng);
    var marker = new google.maps.Marker({icon: 'http://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=bus|bb|'+firebaseId+'|FFF|000', position: busLatLng, map: map });
    buses[firebaseId] = marker;
    // if(typeof bus.route != undefined && bus.route != "null_trip") {
      
    //   if(bus.adherence < 0) {
    //     var color = 'FC1745';
    //   } else if(bus.adherence > 0) {
    //     var color = '0B8A4C';
    //   } else {
    //     var color = 'FFF';
    //   }
    //   l.child(r).on('value', function(s){
    //     var route = s.val();
    //   });
    // }
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
