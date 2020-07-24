const express = require('express');
const router = express.Router();

const Activities = require('../models/Activities');

/* GET all activities */
router.get('/', (req, res, next) => {
    Activities.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET all active activities */
router.get('/active', (req, res, next) => {
    Activities.getAllActive((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET by id user_id and content_detail_id one activity get page */
router.get('/:user_id/:content_detail_id', (req, res, next) => {
    const user_id = req.params.user_id;
    const content_detail_id = req.params.content_detail_id;

    Activities.getOne(user_id, content_detail_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create activity */
router.post('/', (req, res, next) => {
    const { content_detail_id, is_one, activity_start, activity_finish, activity_score, activity_comment, activity_passing_time, active } = req.body;
    const newActivity = new Activities(content_detail_id, is_one, activity_start, activity_finish, activity_score, activity_comment, activity_passing_time, active);

    Activities.create(newActivity, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update activity */
router.put('/:activity_id', (req, res, next) => {
    const activity_id = req.params.activity_id;
    const { activity_start, activity_finish, activity_score, activity_comment, activity_passing_time } = req.body;
    const updateActivity = {
        activity_start: activity_start,
        activity_finish: activity_finish,
        activity_score: activity_score,
        activity_comment: activity_comment,
        activity_passing_time: activity_passing_time
    };
    updateActivity['updated_at'] = new Date().toISOString();

    Activities.update(activity_id, updateActivity, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Deactivate activity */
router.delete('/:activity_id', (req, res, next) => {
    const activity_id = req.params.activity_id;
    Activities.deactivate(activity_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Filter friend activity list scores get method */
router.get('/scores/:user_id/:limit_number', (req, res, next) => {
    const user_id = req.params.user_id;
    const limit_number = req.params.limit_number;

    Activities.getAllFilterScores(user_id, limit_number,(error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Filter friend activity list comments get method */
router.get('/comments/:user_id/:limit_number', (req, res, next) => {
    const user_id = req.params.user_id;
    const limit_number = req.params.limit_number;

    Activities.getAllFilterComments(user_id, limit_number,(error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});


module.exports = router;
