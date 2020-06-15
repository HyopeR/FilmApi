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

let query = `SELECT
    contents_categories.content_id as id,
    contents.tr_name,
    contents.eng_name,
    contents.imdb_score,
    contents.active,
    contents.created_at,
    contents.type_id,
    contents_types.type_name,
    array_agg(categories.name) as categories

    FROM contents
        LEFT JOIN contents_types
        ON contents.type_id = contents_types.id
        LEFT JOIN contents_categories
        ON contents.id = contents_categories.content_id
        LEFT JOIN categories
        ON contents_categories.category_id = categories.id

    GROUP BY
        contents_categories.content_id,
        contents.type_id,
        contents.tr_name,
        contents.eng_name,
        contents.imdb_score,
        contents.active,
        contents.created_at,
        contents_types.type_name,
        contents_categories.content_id
    `;

module.exports = router;
