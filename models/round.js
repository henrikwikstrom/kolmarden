var mongoose = require('mongoose');
var Round = mongoose.model('Round');

module.exports = {
	getProjects: function* () {
		return yield Round.find();
	},

	getProject: function* (id) {
		return yield Round.findOne({_id:id});
	}
}