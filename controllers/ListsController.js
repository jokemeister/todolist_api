const Lists = require('../models/Lists');

class ListsController {
    findAll() {
        return Lists.findAll();
    }
    findOneById(id) {
        return Lists.findOne(parseInt(id));
    }
    createNew(list) {
        return Lists.create(list);
    }
    updateById(id, list) {
        return Lists.update(parseInt(id), list);
    }
    deleteById(id) {
        return Lists.delete(parseInt(id));
    }
};

module.exports = new ListsController();