const express = require('express');
const router = express.Router();

const ContentsTypes = require('../models/ContentsTypes');

/* GET all categories */
router.get('/', (req, res, next) => {
    ContentsTypes.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});


/* GET by id categories */
router.get('/:id', (req, res, next) => {
    const content_type_id = req.params.id;
    ContentsTypes.getOne(content_type_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create categories */
router.post('/', (req, res, next) => {
    const { type_name } = req.body;
    const newContentType = new ContentsTypes(type_name);

    ContentsTypes.create(newContentType, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update categories */
router.put('/:id', (req, res, next) => {
    const content_type_id = req.params.id;
    const { type_name } = req.body;
    const newContentType = new ContentsTypes(type_name);

    ContentsTypes.update(content_type_id, newContentType, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Delete categories */
router.delete('/:id', (req, res, next) => {
    const content_type_id = req.params.id;
    ContentsTypes.delete(content_type_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
