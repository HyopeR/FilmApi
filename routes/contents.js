const express = require('express');
const router = express.Router();

const Contents = require('../models/Contents');

/* GET all contents */
router.get('/', (req, res, next) => {
    Contents.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET all active contents */
router.get('/active', (req, res, next) => {
    Contents.getAllActive((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});


/* GET by id content */
router.get('/:content_id', (req, res, next) => {

    const content_id = req.params.content_id;
    Contents.getOne(content_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET one type contents -> Dizi or film */
router.get('/change/type/:content_type_id', (req, res, next) => {

    const content_type_id = req.params.content_type_id;

    Contents.getFilterType(content_type_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })

});

/* GET one category contents -> Macera, komedi, bilim kurgu vs. */
router.get('/change/category/:category_id', (req, res, next) => {

    const category_id = req.params.category_id;

    Contents.getFilterCategory(category_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })

});

/* GET one type contents -> (Dizi or film) and (Macera, komedi, bilim kurgu vs.) */
router.get('/change/special/:content_type_id/:category_id', (req, res, next) => {

    const content_type_id = req.params.content_type_id;
    const category_id = req.params.category_id;

    Contents.getFilterSpecial(content_type_id, category_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })

});

/* Create content */
router.post('/', (req, res, next) => {
    const { type_id, tr_name, eng_name, imdb_score, poster_url, active } = req.body;
    const newContent = new Contents(type_id, tr_name, eng_name, imdb_score, poster_url, active);

    Contents.create(newContent, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update content */
router.put('/:content_id', (req, res, next) => {
    const content_id = req.params.content_id;
    const { type_id, tr_name, eng_name, imdb_score, poster_url, active } = req.body;
    const newContent = new Contents(type_id, tr_name, eng_name, imdb_score, poster_url, active);

    Contents.update(content_id, newContent, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Deactivate content */
router.delete('/:content_id', (req, res, next) => {
    const content_id = req.params.content_id;
    Contents.deactivate(content_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
