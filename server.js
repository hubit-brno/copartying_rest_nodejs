var config = require(__dirname+"/config.js");
var initDb = require(__dirname+"/initDb.js");

var bodyParser = require('body-parser');
var async = require('async');
var r = require('rethinkdb');

var http = require("http");
var express = require('express');
var app = express();
var router = express.Router();

var WebSocketServer = require("ws").Server
var server = http.createServer(app);
var wss = new WebSocketServer({server: server})

router.get('/coparties', function(req, res, next) {
  r.table('coparties').orderBy({index: 'createdAt'}).run(req.app._rdbConn, function(err, cursor) {
    if(err) {
      return next(err);
    }

    //Retrieve all the todos in an array.
    cursor.toArray(function(err, result) {
      if(err) {
        return next(err);
      }

      res.json(result);
    });
  });
});

router.post('/coparties', function(req, res, next) {

  var coparty = req.body.coparty;
  coparty.createdAt = r.now();

  r.table('coparties').insert(coparty, {returnChanges: true}).run(req.app._rdbConn, function(err, result) {
    if(err) {
      return next(err);
    }

    res.json(result.changes[0] ? result.changes[0].new_val : {});
  });
});



wss.on("connection", function(ws) {

  r.table('coparties').changes().run(app._rdbConn, function(err, cursor){
    cursor.each(function(){
      ws.send("NEW PARTY!", function() {  })
    })
  })

  ws.on("close", function() {
    console.log("websocket connection close");    
  })
})

function startExpress(connection) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use('/api/v1', router);
  app._rdbConn = connection;
  server.listen(config.express.port);
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
