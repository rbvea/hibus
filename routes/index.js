var p = require('node-protobuf').Protobuf,
    request = require('request'), 
    fs = require('fs'),
    Firebase = require('firebase'),
    yaml = require('js-yaml'),
    settings = yaml.safeLoad(fs.readFileSync('config/default.yml', 'utf8'));

  var pb = new p(fs.readFileSync('doc/gtfs-realtime.desc'));

var location_url = 'http://webapps.thebus.org/transitdata/production/vehloc/';
var updates_url = 'http://webapps.thebus.org/transitdata/production/tripupdates/';
var services_url = 'http://webapps.thebus.org/transitdata/production/servicealerts/';

var vehicles = {
  url: location_url,
  encoding: null
}


var firebase = new Firebase(settings.default.firebase + 'vehicle');
var INTERVAL = 6000; 

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

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

