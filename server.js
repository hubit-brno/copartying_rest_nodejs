var config = require(__dirname+"/config.js");
var initDb = require(__dirname+"/initDb.js");

var bodyParser = require('body-parser');
var async = require('async');
var r = require('rethinkdb');

var http = require("http");
var express = require('express');
var app = express();
var router = express.Router();

var expressWs = require('express-ws')(app);

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

router.put('/coparties/:copartyId', function(req, res, next) {

  r.table('coparties').get(req.params.copartyId).update(req.body.coparty).run(req.app._rdbConn, function(err, result) {
    if(err) {
      return next(err);
    }

    res.json(result);

  });
});

router.get('/coparties/:copartyId', function(req, res, next) {
  r.table('coparties').get(req.params.copartyId).run(req.app._rdbConn, function(err, result) {
    if(err) {
      return next(err);
    }

    res.json(result);

  });
});

app.ws('/coparties', function(ws, req) {

  console.log('connect to coparties ws', req.query);
  var copartiesWss = expressWs.getWss('/coparties');
  r.table('coparties').changes().run(app._rdbConn, function(err, cursor){
    cursor.each(function(){
      copartiesWss.clients.forEach(function (client) {
        client.send('COPARTIES UPDATE');
      });
    })
  })

});

var wsClients = {};
app.ws('/coparty', function(ws, req) {

  console.log('connect to coparty ws', req.query);

  wsClients[req.query.copartyId] = wsClients[req.query.copartyId] || [];
  wsClients[req.query.copartyId].push(ws);
  console.log("wsClients: ", wsClients);
  r.table('coparties').get(req.query.copartyId).changes().run(app._rdbConn, function(err, cursor){
    cursor.each(function(){
      wsClients[req.query.copartyId].forEach(function (client) {
        client.send('COPARTY UPDATE: '+req.query.copartyId);
      });
    })
  })

  ws.on('close', function() {
    wsClients[req.query.copartyId].splice( wsClients[req.query.copartyId].indexOf(ws), 1 );
    console.log("wsClients: ", wsClients);
  });

});

function startExpress(connection) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use('/api/v1', router);
  app._rdbConn = connection;
  app.listen(config.express.port);
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
