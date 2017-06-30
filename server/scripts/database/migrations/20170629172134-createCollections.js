'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  // create collections
  return Promise.all([
    db.createCollection('User'),
    db.createCollection('LocalAuth'),
    db.createCollection('Property'),
    db.createCollection('Address'),
    db.createCollection('Room'),
    db.createCollection('File')
  ])
  // create unique indices
  .then(() => Promise.all([
    db.addIndex('User', 'idx_User_email', ['email'], true),
    db.addIndex('LocalAuth', 'idx_LocalAuth_username', ['username'], true)
  ]))
};

exports.down = function(db) {
  // drop all collections
  return Promise.all([
    db.dropCollection('User'),
    db.dropCollection('LocalAuth'),
    db.dropCollection('Property'),
    db.dropCollection('Address'),
    db.dropCollection('Room'),
    db.dropCollection('File')
  ])
};

exports._meta = {
  "version": 1
};
