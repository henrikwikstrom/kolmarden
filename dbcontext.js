var config = require("./config.json");
var log = require('./lib/log')(module);
var mongoose = require('mongoose');
require('./dbmodels/Person');
require('./dbmodels/Project');
require('./dbmodels/Object');
require('./dbmodels/TimeReport');
require('./dbmodels/Round');

mongoose.connect(config.db.connectionstring);
var db = mongoose.connection;
db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback() {
    log.info("Connected to " + config.db.connectionstring);
});