module.exports = function(router, r){

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

  router.put('/coparties/:copartyId/', function(req, res, next) {

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
      item = item.merge({"users": item("users").default([]).append(user)});

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

}
