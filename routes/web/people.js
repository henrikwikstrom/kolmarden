var express = require('express');
var router = express.Router();
var passport = require('passport');

var mongoose = require('mongoose');
var Person = mongoose.model('Person');

var vo = require('vo');

var commonUtils = rootRequire('models/common');

router.param('id', function( req, res, next, id ) {
    req.id_from_param = id;
    next();
});

/* GET people list page. */
router.get('/', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var page = Number((req.query.page !== undefined) ? req.query.page : 1);
        var people = yield Person.find();

        var resultPage = commonUtils.getPage(people, page, 10);

        req.viewbag = Object.assign(req.viewbag, resultPage);

        res.render('person.listing.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {res.send(err);}
    });
});

/* GET edit page */
router.get('/new', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var person = new Person({});

        req.viewbag.person = person;
        req.viewbag.editable = true;
        res.render('person.edit.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {res.send(err);}
    });
});

/* GET person with [:id] */
router.get('/:id', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var person = yield Person.findOne({_id:req.params.id});
        var p = person.toObject();
        p.absence.sort(function(a,b){
            return new Date(b.start) - new Date(a.start);
        });
        
        req.viewbag.person = p;
        req.viewbag.editable = true;
        res.render('person.edit.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {res.send(err);}
    });
});

/* Update person with [:id] */
router.post('/:id', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var options = {safe: true, upsert: true, new: true, runValidators: true};
        var person = yield Person.findOneAndUpdate({_id:req.params.id}, req.body, options);

        var p = person.toObject();
        p.absence.sort(function(a,b){
            return new Date(b.start) - new Date(a.start);
        });
        

        req.viewbag.person = p;
        req.viewbag.editable = true;
        req.viewbag.notification = {
            class: "alert-success",
            message: "Person Saved!"
        };
        res.render('person.edit.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {res.send(err);}
    });
});

module.exports = router;
