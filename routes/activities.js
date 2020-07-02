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
router.get('/', (req, res, next) => {
    Activities.getAllActive((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET by id activity */
router.get('/:activity_id', (req, res, next) => {
    const activity_id = req.params.activity_id;
    Activities.getOne(activity_id, (error, result) => {
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

module.exports = router;
