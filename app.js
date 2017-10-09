var express         = require('express');
var exphbs          = require('express-handlebars');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var session         = require('express-session');
var bodyParser      = require('body-parser');
var passport        = require('passport');
var lessCompiler    = require( 'express-less-middleware' )();

global.log = require('./lib/log')(module);

global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
};


//connect to database
require('./dbcontext');
require('./authentication').init();

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

var hbs = exphbs.create({
    defaultLayout: "main",
    extname: ".handlebars",
    helpers: require("./public/js/lib/handlebarsHelpers.js").helpers, // same file that gets used on our client

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'shared/templates/',
        'views/partials/'
    ],
    layoutsDir: "views/layouts/"
});
// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//Middleware
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));

if( process.env.NODE_ENV === 'dev' ) {
	// this must be "used" before express.use( express.static() ) or it will not work (no next())
	//app.use( lessCompiler );
	app.use(lessCompiler({
		src: __dirname+"/public/styles/less",
		dest: __dirname+"/public/styles/css",
		prefix: "/css",
		// force true recompiles on every request... not the
		// best for production, but fine in debug while working
		// through changes
		force: true,
		debug: true
	}));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'D00M',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

//custom middleware
//creates a viewbag object for storing view data.
app.use(function(req,res,next) {
    var activePage = (req.path == "/") ? "home" : req.path.split('/')[1];

    req.viewbag = {
        nav: {
            active:{},
            pagination: {}
        }
    };
    req.viewbag.nav.active[activePage] = true;
    next();
});


// Middleware to expose the app's shared templates to the client-side of the app
// for pages which need them.
app.use(function exposeTemplates(req, res, next) {
    // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
    // templates which will be shared with the client-side of the app.
    hbs.getTemplates('shared/templates/', {
        cache      : app.enabled('view cache'),
        precompiled: true
    }).then(function (templates) {
        // RegExp to remove the ".handlebars" extension from the template names.
        var extRegex = new RegExp(hbs.extname + '$');

        // Creates an array of templates which are exposed via
        // `res.locals.templates`.
        templates = Object.keys(templates).map(function (name) {
            return {
                name    : name.replace(extRegex, ''),
                template: templates[name]
            };
        });

        // Exposes the templates during view rendering.
        if (templates.length) {
            res.locals.templates = templates;
        }

        setImmediate(next);
    })
        .catch(next);
});

//set up routes

//website routes
app.use('/', require('./routes/web/home'));
app.use('/people', require('./routes/web/people'));
app.use('/projects', require('./routes/web/projects'));
app.use('/objects', require('./routes/web/objects'));
app.use('/rounds', require('./routes/web/round'));

//api routes
app.use('/ajax/people', require('./routes/web/ajax/people'));
app.use('/ajax/projects', require('./routes/web/ajax/projects'));
app.use('/ajax/objects', require('./routes/web/ajax/objects'));
app.use('/ajax/timereports', require('./routes/web/ajax/timeReports'));
app.use('/ajax/rounds', require('./routes/web/ajax/round'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if(req.path.split('/')[1] != "ajax") {
            var errorType = (err.status == 404) ? "404" : "generic";
            res.render('error.'+errorType+'.handlebars', {
                message: err.message,
                error: err
            });
        } else {
            res.json({
                message: err.message,
                error: err,
                stackTrace: err.stack
            });
        }
    });
}
else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if(req.path.split('/')[1] != "ajax") {
            var errorType = (res.status == 404) ? "404" : "generic";
            res.render('error.'+errorType+'.handlebars', {
                message: err.message,
                error: {}
            });
        } else {
            res.json({
                message: err.message,
                error: err
            });
        }
    });
}

module.exports = app;