const Tasks = require('../models/tasks');

class ListsController {
    findAll() {
        console.log('Controller');
        return Tasks.findAll();
    }
    findById(id) {
        console.log('id in controller', id);
        return Tasks.findOne(id);
    }
    findDone() {
        return Tasks.findDashboard();
    }
};

module.exports = new TasksController();