const express = require('express');

function RestfulRoutes(router, controller, model) {
    var self = {
        read,
        write,
        crud
    }

    function read(...middleware) {
        router.get('/', middleware, async function (req, res) {
            if(!req.query.all) req.query.all = false
            let models;
            if (req.params.listId) {
                models = await controller.findByListId(parseInt(req.params.listId), req.query.all);
            } else {
                models = await controller.findAll();
            }
            console.log(req.params);
            if (!models) res.status(404).json({ error: `${model}s were not found` })
            else res.json(models);
        })

        router.get('/:id', middleware, async function (req, res) {
            let oneModel = await controller.findOneById(req.params.id);
            if (!oneModel) res.status(404).json({ error: `${model} was not found` })
            else res.json(oneModel);
        })

        router.get('/collection/today', middleware, async function (req, res) {
            let oneModel = await controller.findToday();
            if (!oneModel) res.status(404).json({ error: `${model} was not found` })
            else res.json(oneModel);
        })

        return self;
    };

    function write(...middleware) {
        router.post('/', middleware, async function (req, res) {
            let oneModel = await controller.createNew(req.body);
            if (!oneModel) res.status(500).json({ error: 'Something goes wrong' })
            else res.json(oneModel)
        })

        router.patch('/:id', middleware, async function (req, res) {
            let oneModel = await controller.updateById(req.params.id, req.body);
            if (!oneModel) res.status(404).json({ error: `${model} was not found` })
            else res.json(oneModel)
        })

        router.put('/:id', middleware, async function (req, res) {
            let oneModel = await controller.exchangeById(req.params.id, req.body);
            if (!oneModel) res.status(404).json({ error: `${model} was not found` })
            else res.json(oneModel)
        })

        router.delete('/:id', middleware, async function (req, res) {
            let oneModel = await controller.deleteById(req.params.id);
            if (!oneModel) res.status(404).json({ error: `${model} was not found` })
            else res.json(oneModel);
        })

        return self;
    };

    function crud(...middleware) {
        return self
            .read(...middleware)
            .write(...middleware)
    };

    return self;
}

module.exports = RestfulRoutes;
