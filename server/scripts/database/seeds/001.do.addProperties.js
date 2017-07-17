
/*
  This script generates N random Property documents by choosing Property
  attributes from the following arrays.

  Seeded Property documents have an id < 0, for easy deletion.
*/
var N = 100

var street1s = [
  'Main St.',
  'Walnut',
  'Pearl St.',
  'Paseo del Prado',
  'Dejvicka',
  'Malirska',
  'Capital of Texas Hwy',
  'Old Main St.',
]

var street2s = [
  'Unit #1',
  'Apt #3A',
  '26A',
  '',
  null,
  '13',
  'E'
]

var cities = [
  'Boulder',
  'Austin',
  'Prague',
  'Munich',
  'San Francisco',
  'Denver',
  'Vail'
]

var states = [
  'Colorado',
  'Texas',
  'Bohemia',
  'California',
  'New York',
  'Alaska'
]

// generate properties
var properties = []
for(var i = 1;i <= N;i++) {
  properties.push({
    id      : -i,
    street1 : street1s[parseInt(Math.random() * street1s.length, 10)],
    street2 : street2s[parseInt(Math.random() * street2s.length, 10)],
    city    : cities[parseInt(Math.random() * cities.length, 10)],
    state   : states[parseInt(Math.random() * states.length, 10)],
    zip     : parseInt(Math.random() * 90000, 10) + 10000
  })
}

// insert randomly generated properties
db.getCollection('Property').insertMany(properties)
