const router = require('express').Router();

const controller = require('../controllers/TasksController');

router.get('/', async function (req, res) {
    let models = await controller.findToday();
    if (!models) res.status(404).json({ error: `${models} was not found` })
    else res.json(models);
})

module.exports = router;