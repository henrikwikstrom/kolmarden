var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Person = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    employee_number: {type: String, unique: true},
    personnumber: {type: String},
    cellphone: {type: String},
    workphone: {type: String},
    address: {
        street: {type: String},
        zipcode:{type: String},
        city: {type: String}
    },
    absence: [{
        cause: {type:String},
        start: {type:String},
        end: {type:String}
    }],
    emergency_contact: {
        name: {type: String},
        phone: {type: String}
    }
});

Person.statics.getSkeleton = function () {
    var data = {};
    Object.keys(Person.paths).forEach(function (path) {
        return path !== '_id' ? data[path] = "" : false;
    });
    return data;
};

mongoose.model('Person', Person);