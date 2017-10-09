var mongoose = require('mongoose');
var Person = mongoose.model('Person');

module.exports = {
    getPeople: function* () {
        return yield Person.find();
    },
    
    getPerson: function* (id) {
        return yield Person.findOne({_id:id});
    }
}