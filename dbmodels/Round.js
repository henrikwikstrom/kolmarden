var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Round = new Schema({
	name: {
		type: String,
		required: true
	},
	stations: {
		type: mongoose.Schema.Types.Mixed, default: []
	}
});

mongoose.model('Round', Round);