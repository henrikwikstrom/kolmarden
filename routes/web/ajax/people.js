var express = require('express');
var router = express.Router();

var vo = require('vo');

var mongoose = require('mongoose');
var Person = mongoose.model('Person');
var Project = mongoose.model('Project');

/* GET people listing. */
router.get('/', function(req, res, next) {
    var fetch = function*() {
        res.json(yield Person.find());
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });

});


/* GET person with [:id] */
router.get('/:id', function(req, res, next) {

    var fetch = function*() {
        res.json(yield Person.findOne({_id:req.params.id}));
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    })
});

/* Create new person */
router.post('/', function(req, res, next) {
    var person = new Person(req.body);

    person.save(function(err, person){
        if(err){ return next(err); }

        res.json(person);
    });
});


/* Update person with [:id] */
router.put('/:id', function(req, res, next) {
    var options = {safe: true, upsert: true, new: true, runValidators: true};
    Person.findOneAndUpdate({_id:req.params.id}, req.body, options, function(err, person) {
        if(err){ return next(err); }

        res.json(person);
    });
});

/* DELETE person with [:id] */
router.delete('/:id', function(req, res, next) {

    var fetch = function*() {
        var query = {_id:req.params.id};

        var projects = yield Project.find({"people.person":req.params.id});
        for (var project of projects) {
            yield Project.findOneAndUpdate({_id:project._id}, { $pull: { people: { person: req.params.id } } });
        }

        yield Person.remove(query);
        res.status(204).send();
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    })
});


/* CREATE or UPDATE absence objects on person with [:id] */
router.post('/:id/absence', function(req, res, next) {
    var fetch = function*() {
        var options = {safe: true, upsert: true, new: true, runValidators: true};

        var person = yield Person.findOne({_id:req.params.id});
        if (person == null) {
            res.status(404).send();
            return;
        }

        var existing = person.absence.filter(function (absenceObject) {
            return absenceObject._id == req.body._id;
        });

        if (existing.length > 0) {
            var query = {_id:req.params.id, absence: {$elemMatch: {_id: req.body._id}}};
            person = yield Person.findOneAndUpdate(query,{$set: {"absence.$": req.body}}, options);
            res.status(200);
        }
        else {
            if (req.body != undefined && req.body != "") {
                person = yield Person.findOneAndUpdate({_id:req.params.id},{$push: {absence: req.body}}, options);
                res.status(201);
            }
        }

        var p = person.toObject();
        p.absence.sort(function(a,b){
            return new Date(b.start) - new Date(a.start);
        });

        res.json(p);
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });
});

/* DELETE absence object with [:absenceid] from person with [:id] */
router.delete('/:id/absence/:absenceid', function(req, res, next) {
    var fetch = function*() {
        var query = {_id:req.params.id};
        var options = {safe: true, upsert: true, new: true, runValidators: true};

        var person = yield Person.findOne(query);
        if (person == null) {
            res.status(404).send();
            return;
        }

        var action = {
            $pull: {
                absence:{ _id: req.params.absenceid }
            }
        };

        person = yield Person.findOneAndUpdate(query,action, options);

        var p = person.toObject();
        p.absence.sort(function(a,b){
            return new Date(b.start) - new Date(a.start);
        });

        res.status(200).json(p);
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });
});

module.exports = router;