const express = require('express');
const router = express.Router();

const Categories = require('../models/Categories');

/* GET all categories */
router.get('/', (req, res, next) => {
    Categories.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET by id categories */
router.get('/:id', (req, res, next) => {
    const category_id = req.params.id;
    Categories.getOne(category_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create categories */
router.post('/', (req, res, next) => {
    const { name } = req.body;
    const newCategory = new Categories(name);

    Categories.create(newCategory, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update categories */
router.put('/:id', (req, res, next) => {
    const category_id = req.params.id;
    const { name } = req.body;
    const newCategory = new Categories(name);

    Categories.update(category_id, newCategory, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Delete categories */
router.delete('/:id', (req, res, next) => {
    const category_id = req.params.id;
    Categories.delete(category_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
