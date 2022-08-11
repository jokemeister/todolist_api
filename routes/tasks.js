const router = require('express').Router({mergeParams: true});

const controller = require('../controllers/TasksController');
const RestfulRoutes = require('./RestfulRoutes');

RestfulRoutes(router, controller, 'Task').crud()

module.exports = router;