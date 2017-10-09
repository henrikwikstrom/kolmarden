'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');

var mongoose = require('mongoose');
var Project = mongoose.model('Project');

var vo = require('vo');

var commonUtils = rootRequire('models/common');

router.param('id', function( req, res, next, id ) {
    req.id_from_param = id;
    next();
});

/* GET projects list page. */
router.get('/', passport.authenticationMiddleware(), function(req, res, next) {

    var fetch = function*() {

        req.viewbag.projects = {};

        var sections = ['ongoing', 'finished', 'all'];
        for (let i in sections) {
            let query = (sections[i] =='all') ? {} : {status:sections[i]} ;
            let result = yield Project.find(query);
            req.viewbag.projects[sections[i]] = commonUtils.getPage(result,1,10);
        }

        res.render('project.listing.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {next(err)}
    });
});

/* GET edit page */
router.get('/new', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var project = new Project({});

        req.viewbag.project = project;
        req.viewbag.editable = true;
        res.render('project.edit.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });
});

/* GET project with [:id] */
router.get('/:id', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var project = yield Project.findOne({_id:req.params.id});
        project = yield project.populate('objects.object').populate('people.person').execPopulate();
        
        var timereports = yield commonUtils.getTimeReportsFromProject(req.params.id, 1);
        req.viewbag.timereports = timereports;

        req.viewbag.project = project;
        req.viewbag.editable = true;
        res.render('project.edit.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });
});

/* Update project with [:id] */
router.post('/:id', passport.authenticationMiddleware(), function(req, res, next) {
    var fetch = function*() {
        var options = {safe: true, upsert: true, new: true, runValidators: true};
        var project = yield Project.findOneAndUpdate({_id:req.params.id}, req.body, options);
        project = yield project.populate('objects.object').populate('people.person').execPopulate();

        var timereports = yield commonUtils.getTimeReportsFromProject(req.params.id, 1);
        req.viewbag.timereports = timereports;

        req.viewbag.project = project;
        req.viewbag.editable = true;
        req.viewbag.notification = {
            class: "alert-success",
            message: "Project Saved!"
        };
        res.render('project.edit.handlebars', req.viewbag);
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });
});

module.exports = router;
