var winston = require('winston');

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/'); //using filename in log statements

    return new winston.Logger({
        transports : [
            new winston.transports.Console({
                prettyPrint: true,
                colorize:   true,
                level:      'debug',
                label:      path
            })
        ]
    });
}

module.exports = getLogger;