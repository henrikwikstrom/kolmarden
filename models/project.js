var mongoose = require('mongoose');
var Project = mongoose.model('Project');

module.exports = {
    getProjects: function* () {
        return yield Project.find();
    },
    
    getProject: function* (id) {
        return yield Project.findOne({_id:id});
    }
}