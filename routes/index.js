const express = require('express');
const router = express.Router();

const tasks = require('./tasks');
const lists = require('./lists');
const dashboard = require('./dashboard');
const todayCollection = require('./todayCollection');

router.use('/tasks', tasks);
router.use('/lists', lists)
router.use('/dashboard', dashboard);
router.use('/collection/today', todayCollection);
router.use('/lists/:listId/tasks', tasks)

module.exports = router;