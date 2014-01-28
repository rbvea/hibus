/**
 * Script for updating route infromation using TheBus gtfs data.
 */

// trips.txt schema
//
// [0] block_id
// [1] route_id
// [2] direction_id
// [3] trip_headsign
// [4] shape_id
// [5] service_id
// [6] trip_id  #set firebase name() to this (replace . with _)

var yaml = require('js-yaml'),
    async = require('async'),
    fs = require('fs'),
    settings = yaml.safeLoad(fs.readFileSync('config/default.yml', 'utf8')),
    Firebase = require('firebase'),
    _ = require('lodash');

var root = new Firebase(settings.default.firebase);
var vehicles = root.child('vehicle');
var trips = root.child('trip');

function parseTrip(split, cb) {
  var trip = split.split(',');
  if(!_.isUndefined(trip[6])) {
    var id = trip[6].replace(/\./g, "_").trim();
    var tripRef = trips.child(id);
    var number = trip[0].split('_')[1].split('-')[0];
    tripRef.child('number').set(number);
    tripRef.child('display').set(trip[3]);
  }
  // console.log('number: ' + number);
  // console.log('numberRef: ' + numberRef.toString());
  // console.log('display: ' + trip[3]);
}

fs.readFile('doc/google_transit/trips.txt', 'utf8', function(err, data) {
  if(!err) {
    var lines = data.split('\n');
    lines.shift();
    async.each(lines, parseTrip, function() {
      console.log('finished!');
    });
  } else {
    console.log('error! ' + err);
  }
});
