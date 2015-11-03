var config = require(__dirname+"/config.js");
var r = require('rethinkdb');
var async = require('async');

function initDb() {
  async.waterfall([
  function connect(callback) {
    r.connect(config.rethinkdb, callback);
  },
  function createDatabase(connection, callback) {
    //Create the database if needed.
    r.dbList().contains(config.rethinkdb.db).do(function(containsDb) {
      return r.branch(
        containsDb,
        {created: 0},
        r.dbCreate(config.rethinkdb.db)
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  },
  function createCoparties(connection, callback) {
    //Create the table if needed.
    r.tableList().contains('coparties').do(function(containsTable) {
      return r.branch(
        containsTable,
        {created: 0},
        r.tableCreate('coparties')
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  },
  function createIndexCoparties(connection, callback) {
    //Create the index if needed.
    r.table('coparties').indexList().contains('createdAt').do(function(hasIndex) {
      return r.branch(
        hasIndex,
        {created: 0},
        r.table('coparties').indexCreate('createdAt')
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  },
  function waitForIndexCoparties(connection, callback) {
    //Wait for the index to be ready.
    r.table('coparties').indexWait('createdAt').run(connection, function(err, result) {
      callback(err, connection);
    });
  }
  ], function(err, connection) {
    if(err) {
      console.error(err);
      process.exit(1);
      return;
    }

    console.log(connection);
  });
}

module.exports = {
  initDb: initDb
}
