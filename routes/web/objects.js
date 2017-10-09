var express = require('express');
var router = express.Router();
var passport = require('passport');

var mongoose = require('mongoose');
var ObjectModel = mongoose.model('Object');

var vo = require('vo');

var commonUtils = rootRequire('models/common');
var PersonUtils = rootRequire('models/person');
var ProjectUtils = rootRequire('models/project');

router.param('id', function( req, res, next, id ) {
    req.id_from_param = id;
    next();
});

/* GET objects list page. */
router.get('/', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var page = Number((req.query.page !== undefined) ? req.query.page : 1);
        var objects = yield ObjectModel.find();

        for (var obj of objects) {
            obj = yield obj.populate("loan.person").populate("loan.project").execPopulate();
        }

        var resultPage = commonUtils.getPage(objects, page, 10);

        req.viewbag = Object.assign(req.viewbag, resultPage);
        res.render('object.listing.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {res.send(err);}
    });
});

/* GET edit page */
router.get('/new', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var obj = new ObjectModel({});
        
        var people = yield PersonUtils.getPeople();
        var projects = yield ProjectUtils.getProjects();

        req.viewbag.people = people;
        req.viewbag.projects = projects;

        req.viewbag.object = obj;
        req.viewbag.editable = true;
        res.render('object.edit.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {res.send(err);}
    });
});

/* GET person with [:id] */
router.get('/:id', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var object = yield ObjectModel.findOne({_id:req.params.id});
        if (object.loan.person == null) { delete object.loan.person; }
        if (object.loan.project == null) { delete object.loan.project; }

        var people = yield PersonUtils.getPeople();
        var projects = yield ProjectUtils.getProjects();

        req.viewbag.people = people;
        req.viewbag.projects = projects;

        req.viewbag.object = object;
        req.viewbag.editable = true;
        res.render('object.edit.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {res.send(err);}
    });
});

/* Update person with [:id] */
router.post('/:id', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var body = req.body;
        delete body.optradio;
        body.available = true;
        body.loan.person = (body.loan.person == '') ? null : body.loan.person;
        body.loan.project = (body.loan.project == '') ? null : body.loan.project;
        if (body.loan.person == null && body.loan.project == null) {
            delete body.loan;
            body.available = false;
        }

        var query = {_id:req.params.id};

        var options = {safe: true, upsert: true, new: true, runValidators: true};
        var object = yield ObjectModel.findOneAndUpdate(query, body, options);
        if (object.loan.person == null) { delete object.loan.person; }
        if (object.loan.project == null) { delete object.loan.project; }

        var people = yield PersonUtils.getPeople();
        var projects = yield ProjectUtils.getProjects();

        req.viewbag.people = people;
        req.viewbag.projects = projects;
        req.viewbag.object = object;
        req.viewbag.editable = true;
        req.viewbag.notification = {
            class: "alert-success",
            message: "Equipment Saved!"
        };
        res.render('object.edit.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {res.send(err);}
    });
});

module.exports = router;