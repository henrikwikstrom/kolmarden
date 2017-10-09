'use strict';

var express = require('express');
var router = express.Router();

var vo = require('vo');
var util = require('../../../lib/util');

var mongoose = require('mongoose');
var Round = mongoose.model('Round');

var commonUtils = rootRequire('models/common');

/* GET projects listing. */
router.get('/', function(req, res, next) {
	Round.find().populate('objects.object').populate('people.person').exec(function(err, projects){
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

		let result = yield Round.find(query);
		response = commonUtils.getPage(result,page,10);

		res.json(response);
	};

	vo(fetch)(function (err) {
		if (err) {next(err);}
	});
});

/* GET project with [:id] */
router.get('/:id', function(req, res, next) {
	Round.findOne({_id:req.params.id}).populate('objects.object').populate('people.person').exec(function (err, project) {
		if(err){ return next(err); }

		res.json(project);
	});
});

/* Create new project */
router.post('/', function(req, res, next) {
	var round = new Round(req.body);

	round.save(function(err, project){
		if(err){ return next(err); }

		round.populate('objects.object').populate('people.person', function (err, proj) {
			res.json(proj);
		});
	});
});

/* Update project with [:id] */
router.put('/:id', function(req, res, next) {
	var query = {};
	var options = {safe: true, upsert: true, new: true, runValidators: true};

	query = {_id:req.params.id};
	Round.findOneAndUpdate(query, req.body, options, function(err, round) {
		if(err){ return next(err); }

		round.populate('objects.object').populate('people.person', function (err, proj) {
			res.json(proj);
		});
	});
});

/* DELETE project with [:id] */
router.delete('/:id', function(req, res, next) {
	var query = {_id:req.params.id};
	Round.remove(query, function(err) {
		if(err){ return next(err); }

		res.status(204).send();
	});
});


module.exports = router;