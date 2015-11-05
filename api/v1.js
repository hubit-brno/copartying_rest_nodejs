module.exports = function(app,express) {
    console.log("Loading API v1");
    //console.log(app);
    var router = express.Router();
    var r = app.locals.r;
    router.get('/coparties', function(req, res, next) {
        r.table('coparties').orderBy({index: 'createdAt'}).run(req.app.__rdbConn, function(err, cursor) {
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

        r.table('coparties').insert(coparty, {returnChanges: true}).run(req.app.__rdbConn, function(err, result) {
            if(err) {
                return next(err);
            }

            res.json(result.changes[0] ? result.changes[0].new_val : {});
        });
    });

    router.put('/coparties/:copartyId/', function(req, res, next) {

        r.table('coparties').get(req.params.copartyId).update(req.body.coparty).run(req.app.__rdbConn, function(err, result) {
            if(err) {
                return next(err);
            }

            res.json(result);

        });
    });

    router.get('/coparties/:copartyId', function(req, res, next) {
        r.table('coparties').get(req.params.copartyId).run(req.app.__rdbConn, function(err, result) {
            if(err) {
                return next(err);
            }

            res.json(result);

        });
    });

    app.use('/api/v1', router);

}
