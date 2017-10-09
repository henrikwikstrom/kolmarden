'use strict';

var express = require('express');
var router = express.Router();

var vo = require('vo');
var util = require('../../../lib/util');

var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Person = mongoose.model('Person');

var commonUtils = rootRequire('models/common');

/* GET projects listing. */
router.get('/', function(req, res, next) {
    Project.find().populate('objects.object').populate('people.person').exec(function(err, projects){
        if(err){ return next(err); }

        res.json(projects);
    });
});

/* GET projects listing. */
router.get('/filter', function(req, res, next) {

    var fetch = function*() {
        var response = {};

        let query = {};
        if (req.query.field !== undefined && req.query.value !== undefined && req.query.value != "" && req.query.value != "all") {
            query[req.query.field] = req.query.value;
        }

        let page = Number((req.query.page !== undefined) ? req.query.page : 1);

        let result = yield Project.find(query);
        response = commonUtils.getPage(result,page,10);

        res.json(response);
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });
});

/* GET project with [:id] */
router.get('/:id', function(req, res, next) {
   Project.findOne({_id:req.params.id}).populate('objects.object').populate('people.person').exec(function (err, project) {
       if(err){ return next(err); }

       res.json(project);
   });
});

/* Create new project */
router.post('/', function(req, res, next) {
    var project = new Project(req.body);

    project.save(function(err, project){
        if(err){ return next(err); }

        project.populate('objects.object').populate('people.person', function (err, proj) {
            res.json(proj);
        });
    });
});

/* Update project with [:id] */
router.put('/:id', function(req, res, next) {
    var query = {};
    var options = {safe: true, upsert: true, new: true, runValidators: true};

    // if body contains populated person documents update them in the Person collection.
    if (typeof req.body.people !== 'undefined' && req.body.people.length > 0) {
        for (i = 0; i < req.body.people.length; i++) {
            if (req.body.people[i].person._id) {
                query = {_id:req.body.people[i].person._id};
                Person.findOneAndUpdate(query, req.body.people[i].person, options, function(err, person) {
                    if(err){ return next(err); }
                });
            }
        }
    }

    // if body contains populated object documents update them in the Object collection.
    if (typeof req.body.objects !== 'undefined' && req.body.objects.length > 0) {
        for (i = 0; i < req.body.objects.length; i++) {
            if (req.body.objects[i].object._id) {
                query = {_id:req.body.objects[i].object._id};
                Object.findOneAndUpdate(query, req.body.objects[i].object, options, function(err, object) {
                    if(err){ return next(err); }
                });
            }
        }
    }

    query = {_id:req.params.id};
    Project.findOneAndUpdate(query, req.body, options, function(err, project) {
        if(err){ return next(err); }

        project.populate('objects.object').populate('people.person', function (err, proj) {
            res.json(proj);
        });
    });
});

/* DELETE project with [:id] */
router.delete('/:id', function(req, res, next) {
    var query = {_id:req.params.id};
    Project.remove(query, function(err) {
        if(err){ return next(err); }

        res.status(204).send();
    });
});


/**
 * Section: Add/Edit/Remove references
 */

// Add person or multiple people to project (send personid and properties in body)
router.post('/:id/people', function(req, res, next) {
    var fetch = function*() {
        var query = {_id:req.params.id};
        var options = {safe: true, upsert: true, new: true, runValidators: true};

        var body = (util.isArray(req.body)) ? req.body : [req.body];

        var project = yield Project.findOne(query);
        if (project == null) {
            res.status(404).send();
            return;
        }

        for (var i in body) {
            var existing = project.people.filter(function (assignment) {
                return assignment.person == body[i].person;
            });

            if (existing.length > 0) {
                var upsert = existing[0].toObject();
                upsert.end = body[i].end;
                upsert.start = body[i].start;
                upsert.role = body[i].role;
                project = yield Project.findOneAndUpdate(query, { $pull: { people: { person: body[i].person } } }, options);
                project = yield Project.findOneAndUpdate(query, { $push:{people:upsert} }, options);
            }
            else {
                if (body[i].person != undefined) {
                    project = yield Project.findOneAndUpdate(query, {$push: {people: body[i]}}, options);
                }
            }
        }

        project = yield project.populate('objects.object').populate('people.person').execPopulate();

        res.json(project);
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });
});

// Add object to project (send personid and properties in body)
router.post('/:id/objects', function(req, res, next) {
    var fetch = function*() {
        var query = {_id:req.params.id};
        var options = {safe: true, upsert: true, new: true, runValidators: true};

        var body = (util.isArray(req.body)) ? req.body : [req.body];

        var project = yield Project.findOne(query);
        for (var i in body) {
            var existing = project.objects.filter(function (assignment) {
                return assignment.object == body[i].object;
            });

            if (existing.length > 0) {
                var upsert = existing[0].toObject();
                upsert.end = body[i].end;
                upsert.start = body[i].start;
                project = yield Project.findOneAndUpdate(query, { $pull: { objects: { object: body[i].object } } }, options);
                project = yield Project.findOneAndUpdate(query, { $push:{objects:upsert} }, options);
            }
            else {
                project = yield Project.findOneAndUpdate(query, { $push:{objects:body[i]} }, options);
            }
        }

        yield project.populate('objects.object').populate('people.person').execPopulate();

        res.json(project);
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });
});

// Remove person from project
router.delete('/:id/people/:personid', function(req, res, next) {
    console.log(req.params.id);
    var query = {_id:req.params.id};
    var options = {safe: true, upsert: true, new: true, runValidators: true};

    var action = {
        $pull: {
            people:{ person: req.params.personid }
        }
    };

    Project.findOneAndUpdate(query, action, options, function(err, project){
        if(err){ return next(err); }

        project.populate('objects.object').populate('people.person', function (err, proj) {
            res.json(proj);
        });
    });
});

// Remove object from project
router.delete('/:id/objects/:objectid', function(req, res, next) {
    var query = {_id:req.params.id};
    var options = {safe: true, upsert: true, new: true, runValidators: true};

    var action = {
        $pull: {
            objects:{ object: req.params.objectid }
        }
    };

    Project.findOneAndUpdate(query, action, options, function(err, project){
        if(err){ return next(err); }

        project.populate('objects.object').populate('people.person', function (err, proj) {
            res.json(proj);
        });
    });
});


/**
 * Section: Time Reports
 */

router.get('/:id', function(req, res, next) {
    var fetch = function*() {
        let page = Number((req.query.page !== undefined) ? req.query.page : 1);
        var response = commonUtils.getTimeReportsFromProject(req.params.id, page)

        res.json(response);
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });
});


module.exports = router;