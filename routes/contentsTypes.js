const express = require('express');
const router = express.Router();

const ContentsTypes = require('../models/ContentsTypes');

/* GET all content types */
router.get('/', (req, res, next) => {
    ContentsTypes.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});


/* GET by id content type */
router.get('/:content_type_id', (req, res, next) => {
    const content_type_id = req.params.content_type_id;
    ContentsTypes.getOne(content_type_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create content type */
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

/* Update content type */
router.put('/:content_type_id', (req, res, next) => {
    const content_type_id = req.params.content_type_id;
    const { type_name } = req.body;
    const newContentType = new ContentsTypes(type_name);

    ContentsTypes.update(content_type_id, newContentType, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Delete content type */
router.delete('/:content_type_id', (req, res, next) => {
    const content_type_id = req.params.content_type_id;
    ContentsTypes.delete(content_type_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
