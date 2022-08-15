const router = require('express').Router();

const controller = require('../controllers/ListsController');
const RestfulRoutes = require('./RestfulRoutes');

RestfulRoutes(router, controller, 'List').crud()

module.exports = router;