const Tasks = require('../models/tasks');

class TasksController {
    findAll() {
        console.log('Controller');
        return Tasks.findAll();
    }
    findByListId(listId, all) {
        return Tasks.findByListId(listId, all);
    }
    findOneById(id) {
        console.log('id in controller', id);
        return Tasks.findOneById(id);
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
    exchangeById(id, task) {
        return Tasks.exchange(parseInt(id), task)
    }
    updateById(id, task) {
        return Tasks.update(parseInt(id), task, { new: true });
    }
    deleteById(id) {
        return Tasks.delete(parseInt(id));
    }
};

module.exports = new TasksController();