function JsonParams(data) {
  if (data === undefined) {
    throw "Object can't be undefined!"
  }
  this.data = JSON.parse(JSON.stringify(data));

  if (!(this instanceof JsonParams)){
        return new JsonParams(arguments[0]);
   }
}

JsonParams.prototype.clone = function() {
  return copy(this.data);
}

JsonParams.prototype.only = function(params) {
  var newObject = {};  
  for(var i = 0; i < params.length; i++) {
    newObject[params[i]] = copy(this.data[params[i]]);
  }
  return newObject;
}

function copy(data) {
  if (data===undefined) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(data))
}

module.exports = JsonParams;
