var config = require(__dirname+"/config.js");
var bodyParser = require('body-parser');
var r = require('rethinkdb');
var fs = require('fs');
var express = require('express');
var http = require("http");
var socketHooks = require(__dirname + '/socket-hooks.js');
var coparty = require(__dirname+"/coparty.js")(express, http, bodyParser, r, fs, socketHooks);


coparty.run(config);
