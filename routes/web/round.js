'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');

var mongoose = require('mongoose');
var Round = mongoose.model('Round');

var vo = require('vo');

var commonUtils = rootRequire('models/common');

router.param('id', function( req, res, next, id ) {
	req.id_from_param = id;
	next();
});

/* GET route list page. */
router.get('/', passport.authenticationMiddleware(), function(req, res, next) {

	var fetch = function*() {

		req.viewbag.rounds = {};

		var page = Number((req.query.page !== undefined) ? req.query.page : 1);
		var rounds = yield Round.find();
		var resultPage = commonUtils.getPage(rounds, page, 10);
		req.viewbag = Object.assign(req.viewbag, resultPage);

		res.render('round.listing.handlebars', req.viewbag);
	};

	vo(fetch)(function (err) {
		if (err) {next(err)}
	});
});

/* GET edit page */
router.get('/new', passport.authenticationMiddleware(), function(req, res, next) {
	var fetch = function*() {
		var round = new Round({});

		req.viewbag.round = round; round.name = 'kalle';
		req.viewbag.editable = true;
		res.render('round.edit.handlebars', req.viewbag);
	};

	vo(fetch)(function (err) {
		if (err) {next(err);}
	});
});

/* GET project with [:id] */
router.get('/:id', passport.authenticationMiddleware(), function(req, res, next) {
	var fetch = function*() {
		var round = yield Round.findOne({_id:req.params.id});
		round = yield round.populate('objects.object').populate('people.person').execPopulate();

		req.viewbag.round = round;
		req.viewbag.editable = true;
		res.render('round.edit.handlebars', req.viewbag);
	};

	vo(fetch)(function (err) {
		if (err) {next(err);}
	});
});

/* Update project with [:id] */
router.post('/:id', passport.authenticationMiddleware(), function(req, res, next) {
	var fetch = function*() {
		var options = {safe: true, upsert: true, new: true, runValidators: true};
		var round = yield Round.findOneAndUpdate({_id:req.params.id}, req.body, options);
		round = yield round.populate('objects.object').populate('people.person').execPopulate();

		req.viewbag.round = round;
		req.viewbag.editable = true;
		req.viewbag.notification = {
			class: "alert-success",
			message: "Ronden sparad!"
		};
		res.render('round.edit.handlebars', req.viewbag);
	};

	vo(fetch)(function (err) {
		if (err) {next(err);}
	});
});

module.exports = router;
