var express = require('express');
var router = express.Router();

var vo = require('vo');

var mongoose = require('mongoose');
var TimeReport = mongoose.model('TimeReport');

router.get('/', function(req, res, next) {
    var fetch = function*() {
        res.json(yield TimeReport.find());
    };

    vo(fetch)(function (err) {
        if (err) {next(err);}
    });

});

/* Create new timeReport */
router.post('/', function(req, res, next) {
    var timereport = new TimeReport(req.body);

    timereport.save(function(err, person){
        if(err){ return next(err); }

        res.json(person);
    });
});

module.exports = router;