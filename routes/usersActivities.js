const express = require('express');
const router = express.Router();

const UsersActivities = require('../models/UsersActivities');

/* GET all users activities */
router.get('/', (req, res, next) => {
    UsersActivities.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET one user ativity */
router.get('/:user_id/:activity_id', (req, res, next) => {

    const user_id = req.params.user_id;
    const activity_id = req.params.activity_id;

    UsersActivities.getOne(user_id, activity_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create user activity */
router.post('/', (req, res, next) => {
    const { user_id, activity_id } = req.body;
    const newUserActivity = new UsersActivities(user_id, activity_id);

    UsersActivities.create(newUserActivity, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
