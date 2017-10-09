var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TimeReport = new Schema({
    person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    start: {type:String},
    end: {type:String}
});

mongoose.model('TimeReport', TimeReport);