var express = require('express');
var Database = require('arangojs');
var app = express();

var port = process.env.PORT || 8080;
var router = express.Router();
var db = new Database('http://hub1:IFeelGood1@46.28.108.92:8529');



// http://expressjs.com/4x/api.html#router
router.get('/', function(req, res) {
    res.json({
        message: "Let's have a geek party!"
    });
});



app.use('/api/v1', router);
app.listen(port);

console.log('Party at port ' + port);
console.log(db);
