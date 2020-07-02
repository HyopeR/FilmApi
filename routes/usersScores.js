const express = require('express');
const router = express.Router();

const UsersScores = require('../models/UsersScores');

/* GET all users scores */
router.get('/', (req, res, next) => {
    UsersScores.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET one content's mean users scores */
router.get('/content/:content_id', (req, res, next) => {
    const content_id = req.params.content_id;

    UsersScores.getContentMeanScore(content_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});


/* GET by id users scores row */
router.get('/:user_id/:content_id', (req, res, next) => {
    const user_id = req.params.user_id;
    const content_id = req.params.content_id;

    UsersScores.getOne(user_id, content_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create users scores */
router.post('/', (req, res, next) => {
    const { user_id, content_id, score } = req.body;
    const newUserScore = new UsersScores(user_id, content_id, score);

    UsersScores.create(newUserScore, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update users scores score */
router.put('/:user_id/:content_id', (req, res, next) => {
    const user_id = req.params.user_id;
    const content_id = req.params.content_id;

    const { score } = req.body;
    const updateUserScore = { score: score };
    updateUserScore['updated_at'] = new Date().toISOString();

    UsersScores.update(user_id, content_id, updateUserScore, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Delete users room row */
router.delete('/:user_id/:content_id', (req, res, next) => {
    const user_id = req.params.user_id;
    const content_id = req.params.content_id;

    UsersScores.delete(user_id, content_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
