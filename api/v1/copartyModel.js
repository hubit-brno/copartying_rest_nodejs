var validate = require("validate.js");
var JsonParams = require("../../jsonParams.js");

var copartyParams = {
  "id": {},
  "name": {
    presence: true
  },
  "date": {
    presence: true,
    datetime: true
  },
  "place": {
    presence: true
  },
  "createdAt": {
    datetime: true
  },
  "expected_number": {
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  },
  "items": {
    array: true
  }
};

function Coparty(data) {

  if (data === undefined) {
    throw "Coparty can't be undefined!"
  }

  this.data = JsonParams(data).only(Object.keys(copartyParams));
  this.errors = [];

  this.validateCoparty = function() {
    this.errors = validate(this.data, copartyParams);    
    return !this.errors;
  }

  this.to_json = function() {
    return JSON.parse(JSON.stringify(data));
  }

  this.getErrors = function() {
    return JSON.parse(JSON.stringify(this.errors));
  }

  this.set = function(key, value) {
    this.data[key] = value;
  }

  this.get = function(key) {
    return this.data[key];
  }
}

module.exports = Coparty;
