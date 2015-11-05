module.exports = function (express, http, bodyParser, r, fs, socketHooks) {

    var app = express();
    var httpServer = http.Server(app);

    return {
        _rdbConn: undefined,
        config: undefined,
        /**
         * Connects RethinkDB. Saves connection in _rdbConn.
         */
        connectDb: function () {
            var coparty = this;
            r.connect(this.config.rethinkdb, function (err, conn) {
                if (err) throw err;
                coparty._rdbConn = conn;
                coparty.startExpress();
            })
        },
        /**
         * Starts expressjs, socketIO.
         */
        startExpress: function () {
            app.use(express.static('static'));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            //persist connection to app object for future use.
            //We do not want to pass it everywhere.
            app._rdbConn = this._rdbConn;
            app.locals.r = r;
            this.loadApi();
            //Init websockets and RestAPI
            socketHooks.initSockets(app, httpServer);
            httpServer.listen(this.config.express.port);
            console.log('Listening on port ' + this.config.express.port);
        },

        /**
         * Loads api defined in config.
         */
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

        /**
         * Runs application.
         * @param config
         */
        run: function (config) {
            this.config = config;
            //rethinkDb starts expressjs after connection is established
            this.connectDb();
        }
    }
};
