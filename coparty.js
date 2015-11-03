var config = require(__dirname+'/config.js');
var thinky = require('thinky')(config);
var r = thinky.r;
var type = thinky.type;

var Coparty = thinky.createModel("Coparty", {
  id: type.string(),
  name: type.string(),
  description: type.string(),
  date: type.date(),
  place: type.string(),
  expected_number: type.number(),
  createdAt: type.string().default(r.now()),
  items: [{
    id: type.string(),
    name: type.string(),
    description: type.string(),
    volume: type.string(),
    count: type.number(),
    user_email: type.string()
  }]
});
