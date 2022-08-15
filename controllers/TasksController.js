const Tasks = require('../models/Tasks');

class TasksController {
    findAll() {
        return Tasks.findAll();
    }
    findByListId(listId, all) {
        return Tasks.findByListId(parseInt(listId), all);
    }
    findOneById(id) {
        return Tasks.findOneById(parseInt(id));
    }
    findDashboard() {
        return Tasks.findDashboard();
    }
    findToday() {
        return Tasks.findToday();
    }
    createNew(task) {
        return Tasks.create(task);
    }
    replaceById(id, task) {
        return Tasks.replace(parseInt(id), task)
    }
    updateById(id, task) {
        return Tasks.update(parseInt(id), task);
    }
    deleteById(id) {
        return Tasks.delete(parseInt(id));
    }
};

module.exports = new TasksController();