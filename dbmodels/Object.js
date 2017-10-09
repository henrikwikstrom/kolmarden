var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Object = new Schema({
    name: {
        type: String,
        required: true
    },
    serialnumber: {type:String},
    purchasedate:{type:String},
    category: {type:String},
    available: {type:Boolean},
    loan: {
        project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
        start: {type:String},
        end:{type:String}
    },
    loan_history: [{
        project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
        start: {type:String},
        end:{type:String}
    }]
});

mongoose.model('Object', Object);