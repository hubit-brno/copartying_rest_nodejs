var config = require(__dirname+"/config.js");
var initDb = require(__dirname+"/initDb.js");

var bodyParser = require('body-parser');
var async = require('async');
var r = require('rethinkdb');

var http = require("http");
var express = require('express');
var app = express();
var router = express.Router();

var server = http.Server(app);

var copartyRoutes = require(__dirname+"/coparty-routes.js");
var socketHooks = require(__dirname + '/socket-hooks.js');

app.use(express.static('static'));

// NOTE: looks like this is not needed afterall. Sorry Jakub :)
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:8080");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

function startExpress(connection) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app._rdbConn = connection;
  copartyRoutes(app, r);
  server.listen(config.express.port);
  socketHooks.initSockets(app, server);
  console.log('Listening on port ' + config.express.port);
}

function connectDb(callback) {
  r.connect(config.rethinkdb, function(err, conn) {
      if (err) throw err;
      startExpress(conn);
  })
}

connectDb();
//initDb.initDb();
