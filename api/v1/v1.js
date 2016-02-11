var Coparty = require('./copartyModel.js');

module.exports = function(app,express) {
    console.log("Loading API v1");
    //console.log(app);
    var router = express.Router();
    var r = app.locals.r;

    router.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    router.get('/coparties', function(req, res, next) {
      r.table('coparties').orderBy({index: 'createdAt'}).run(req.app._rdbConn, function(err, cursor) {
        if(err) {
          return next(err);
        }

        cursor.toArray(function(err, result) {
          if(err) {
            return next(err);
          }

          res.json(result);
        });
      });
    });

    router.post('/coparties', function(req, res, next) {

      var data = req.body.coparty;
      data.createdAt = r.now();
      var coparty = new Coparty(data);

      if (coparty.validateCoparty()) {
        r.table('coparties').insert(coparty.to_json(), {returnChanges: true}).run(req.app._rdbConn, function(err, result) {
          if(err) {
            return next(err);
          }

          res.json(result.changes[0] ? result.changes[0].new_val : {});
        });
      } else {
        res.json({coparty: coparty.to_json(), errors: coparty.getErrors()})
      }

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


    router.post('/coparties/:copartyId/items/:itemId', function(req, res, next) {

      var user = req.body.user;
      user.createdAt = r.now();

      r.table('coparties').get(req.params.copartyId).update(function(row) {

        var item = row("items").filter({"id": req.params.itemId.toString()})(0);

        var existedUser = item("users").default([{"email": user["email"], "count": 0}]).filter({"email": user["email"]})(0).default({"email": user["email"], "count": 0})
        existedUser = existedUser.merge({"count": existedUser("count").add(parseInt(user["count"]))});
        var otherUsers = item("users").default([{"email": user["email"]}]).filter(function(us) {
          return us("email").ne(user["email"]);
        });
        item = item.merge({"users": otherUsers.append(existedUser)});

        var otherItems = row("items").filter(function(it){
          return it("id").ne(req.params.itemId.toString());
        })
        return {"items": otherItems.append(item)};

      }).run(req.app._rdbConn, function(err, result) {
        if(err) {
          return next(err);
        }

        res.json(result);

      });
    });

    app.use('/api/v1', router);

}
