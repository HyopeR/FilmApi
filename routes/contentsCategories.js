const express = require('express');
const router = express.Router();

const ContentsCategories = require('../models/ContentsCategories');

/* GET all content categories */
router.get('/', (req, res, next) => {
    ContentsCategories.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});


/* GET by id content category */
router.get('/:content_id', (req, res, next) => {
    const content_id = req.params.content_id;

    ContentsCategories.getOne(content_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create content category */
router.post('/', (req, res, next) => {
    const { content_id, category_id } = req.body;
    const newContentCategory = new ContentsCategories(content_id, category_id);

    ContentsCategories.create(newContentCategory, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update content category */
router.put('/:content_id/:category_id', (req, res, next) => {
    const param_content_id = req.params.content_id;
    const param_category_id = req.params.category_id;

    const { content_id, category_id } = req.body;
    const newContentCategory = new ContentsCategories(content_id, category_id);

    ContentsCategories.update(param_content_id, param_category_id, newContentCategory, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Delete content category */
router.delete('/:content_id/:category_id', (req, res, next) => {
    const param_content_id = req.params.content_id;
    const param_category_id = req.params.category_id;

    ContentsCategories.delete(param_content_id, param_category_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
