var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = new Schema({
    name: {
        type: String,
        required: true
    },
    ao_number: {type: String},
    start: {type:String},
    end: {type:String},
    address: {
        street: {type: String},
        zipcode:{type: String},
        city: {type: String},
    },
    estimated_hours: {type: Number},
    status: {type: String},
    people: [{
        person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
        role: {type:String},
        start: {type:String},
        end: {type:String},
        days: {type:Number},
        _id: false,
    }],
    objects: [{
        object: { type: mongoose.Schema.Types.ObjectId, ref: 'Object' },
        start: {type:String},
        end: {type:String}
    }]
});

mongoose.model('Project', Project);