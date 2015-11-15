var config = require(__dirname+"/config.js");
var bodyParser = require('body-parser');
var r = require('rethinkdb');
var fs = require('fs');
var express = require('express');
var http = require("http");
var socketHooks = require(__dirname + '/socket-hooks.js');
var coparty = require(__dirname+"/coparty.js")(express, http, bodyParser, r, fs, socketHooks);


var validate = require("validate.js");
validate.extend(validate.validators.datetime, {
  parse: function(value, options) {
    return Date.parse(value);
  },
  format: function(value, options) {
    var date = new Date(value);
    return date.toISOString();
  }
});

validate.validators.array = function(value, attributes, attributeName, options, constraints) {
  if (value === undefined || validate.isArray(value)) {
    return null;
  }
  return "must be array or null";
}

//run coparty Application
coparty.run(config);
