/**
 * Script for updating busses with trips from TheBus's vehicle api 
 * and updating route infromation using TheBus gtfs data.
 */
var request = require('request'),
    yaml = require('js-yaml'),
    xml = require('xml2js'),
    async = require('async'),
    fs = require('fs'),
    settings = yaml.safeLoad(fs.readFileSync('/home/rbvea/hibus/config/default.yml', 'utf8')),
    Firebase = require('firebase'),
    _ = require('lodash'),
    api = 'http://api.thebus.org/vehicle';

var root = new Firebase(settings.default.firebase);
var vehicles = root.child('vehicle');
var trips = root.child('trip');

// //request xml for all vehicles
request({
  url: api,
  qs:{ 
    key: settings.default.api,
  }
}, function(err, res, body) {
  if(!err){
    xml.parseString(body, function(err, result) {
      if(!err) {
        var busses = result.vehicles.vehicle;

        //validate that bus data on firebase exists, set if trip != null
        function parseBus(bus, cb) {
          var bus_thing = vehicles.child(bus.number[0]); 
          bus_thing.once('value', function(data) {
            var trip = bus.trip[0];
            if(_.isObject(data.val()) && trip != 'null_trip') {
              bus_thing.child('trip').set(trip, function(err) {
                if(err) {
                  console.log('error!');
                  console.log(err);
                } else {
		  console.log('set id: ' + bus_thing.name() + ' to ' + trip); 
		}
              });
            } 
          });
          cb();
        }

        //loop through all busses and parse them
        async.each(busses, parseBus, function() {
          console.log('finished!');
        });
      }
    });
  }
});


