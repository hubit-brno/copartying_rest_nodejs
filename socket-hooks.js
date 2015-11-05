var socketIO = require('socket.io');
var r = require('rethinkdb');

var
  io = null,
  dbConn = null,
  socketTokens = {};


// app.ws('/coparties', function(ws, req) {

//   console.log('connect to coparties ws', req.query);
//   var copartiesWss = expressWs.getWss('/coparties');
//   r.table('coparties').changes().run(app._rdbConn, function(err, cursor){
//     cursor.each(function(){
//       copartiesWss.clients.forEach(function (client) {
//         client.send('COPARTIES UPDATE');
//       });
//     })
//   })

// });

// var wsClients = {};
// app.ws('/coparty', function(ws, req) {

//   console.log('connect to coparty ws', req.query);

//   wsClients[req.query.copartyId] = wsClients[req.query.copartyId] || [];
//   wsClients[req.query.copartyId].push(ws);
//   console.log("wsClients: ", wsClients);
//   r.table('coparties').get(req.query.copartyId).changes().run(app._rdbConn, function(err, cursor){
//     cursor.each(function(){
//       wsClients[req.query.copartyId].forEach(function (client) {
//         client.send('COPARTY UPDATE: '+req.query.copartyId);
//       });
//     })
//   })

//   ws.on('close', function() {
//     wsClients[req.query.copartyId].splice( wsClients[req.query.copartyId].indexOf(ws), 1 );
//     console.log("wsClients: ", wsClients);
//   });

// });


function onConnection(socket) {
  console.log('socket connected');

  socketTokens[socket.id] = socket.handshake.query.token;

  r.table('coparties').changes().run(dbConn, function(err, cursor) {
    cursor.each(function() {
      io.emit('coparties_updated');
    });
  });
}



module.exports = {

  initSockets: function(app, server) {
    io = socketIO(server);
    dbConn = app._rdbConn;

    io.on("_rdbConn", onConnection);
  }

};
