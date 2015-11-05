module.exports = function (express, http, bodyParser, r, fs, socketHooks) {

    var app = express();
    var httpServer = http.Server(app);

    return {
        _rdbConn: undefined,
        config: undefined,
        connectDb: function () {
            var coparty = this;
            r.connect(this.config.rethinkdb, function (err, conn) {
                if (err) throw err;
                coparty._rdbConn = conn;
                coparty.startExpress();
            })
        },
        startExpress: function () {
            app.use(express.static('static'));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.__rdbConn = this._rdbConn;
            app.locals.r = r;
            this.loadApi();
            socketHooks.initSockets(app, httpServer);
            httpServer.listen(this.config.express.port);
            console.log('Listening on port ' + this.config.express.port);
        },

        loadApi: function () {
            this.config.api.forEach(function (version) {
                var path = __dirname + "/api/" + version + ".js";
                console.log(path);
                fs.exists(path, function (exists) {
                    if (exists) {
                        require(path)(app, express);
                    } else {
                        console.log('Api ' + version + ' does not exist.');
                    }
                })
            });
        },

        run: function (config) {
            this.config = config;
            //rethinkDb starts expressjs
            this.connectDb();
        }
    }
};
