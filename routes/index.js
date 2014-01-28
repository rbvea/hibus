var p = require('node-protobuf').Protobuf,
    request = require('request'), 
    fs = require('fs'),
    Firebase = require('firebase'),
    yaml = require('js-yaml'),
    settings = yaml.safeLoad(fs.readFileSync('config/default.yml', 'utf8')),
    gtfs = require('gtfs'),
    pb = new p(fs.readFileSync('doc/gtfs-realtime.desc')),
    location_url = 'http://webapps.thebus.org/transitdata/production/vehloc/',
    updates_url = 'http://webapps.thebus.org/transitdata/production/tripupdates/',
    services_url = 'http://webapps.thebus.org/transitdata/production/servicealerts/',
    vehicles = {
      url: location_url,
      encoding: null
    },
    firebase = new Firebase(settings.default.firebase + 'vehicle');

var INTERVAL = 15000; 

function getBusses() {
  request(vehicles, function(error, response, body){
    if(!error && response.statusCode == 200) { 
      var result = pb.Parse(body, "transit_realtime.FeedMessage"); 
      var busses = result.entity;
      for(i in busses) {
        var bus = busses[i].vehicle;
        var firebus = firebase.child(bus.vehicle.id);
        firebus.set({lat: bus.position.latitude, lng: bus.position.longitude});
      }
    };
  });
}

//init busses
getBusses();
setInterval(getBusses, INTERVAL);

exports.map = function(req, res){
  res.render('map');
};

exports.index = function(req, res) {
  res.render('index'); 
};
