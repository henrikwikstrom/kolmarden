var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ObjectModel = mongoose.model('Object');

/* GET objects listing. */
router.get('/', function(req, res, next) {
    ObjectModel.find(function(err, objects){
        if(err){ return next(err); }

        res.json(objects);
    });
});

/* GET object with [:id] */
router.get('/:id', function(req, res, next) {
    ObjectModel.findOne({_id:req.params.id}, function (err, object) {
        if(err){ return next(err); }

        res.json(object);
    });
});

/* Create new object */
router.post('/', function(req, res, next) {
    var object = new ObjectModel(req.body);

    object.save(function(err, object){
        if(err){ return next(err); }

        res.json(object);
    });
});

/* Update object with [:id] */
router.put('/:id', function(req, res, next) {
    var options = {safe: true, upsert: true, new: true, runValidators: true};
    ObjectModel.findOneAndUpdate({_id:req.params.id}, req.body, options, function(err, object) {
        if(err){ return next(err); }

        res.json(object);
    });
});

/* DELETE object with [:id] */
router.delete('/:id', function(req, res, next) {
    var query = {_id:req.params.id};
    ObjectModel.remove(query, function(err) {
        if(err){ return next(err); }

        res.status(204).send();
    });
});

module.exports = router;