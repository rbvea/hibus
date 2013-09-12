require('js-yaml');
var xml = require('xml2js');
var request = require('request');
var Firebase = require('firebase');
try{
  var settings = require('../config/default.yml');
} catch(e) {
  console.log(e);
}

var vehicleUrl = 'http://api.thebus.org/vehicle/?key=' + settings.default.key;
var firebase = new Firebase(settings.default.firebase + 'vehicle');
var INTERVAL = 6000;

setInterval(function() {
  request(vehicleUrl, function(error, response, body){
    if(!error && response.statusCode == 200) { 
      xml.parseString(body, function(err, result) {
        if(!err) {
          var busses = result.vehicles.vehicle;
          for(i in busses) {
            var bus = busses[i];
            var firebus = firebase.child(bus.number[0])
            firebus.set({lat: bus.latitude[0], lng: bus.longitude[0], route: bus.trip[0], adherence: bus.adherence[0]});
          }
        } else {
          console.log(err);
        }
      });
    };
  });
}, INTERVAL);

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

