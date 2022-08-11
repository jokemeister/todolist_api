const router = require('express').Router();

const controller = require('../controllers/TasksController');

router.get('/', async function (req, res) {
    let oneModel = await controller.findDashboard();
    if (!oneModel) res.status(404).json({ error: `${model} was not found` })
    else res.json(oneModel);
})

module.exports = router;