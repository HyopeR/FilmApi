const express = require('express');
const router = express.Router();

const RoomsActivities = require('../models/RoomsActivities');

/* GET all rooms activities */
router.get('/', (req, res, next) => {
    RoomsActivities.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET one rooms activity */
router.get('/:room_id/:activity_id', (req, res, next) => {

    const room_id = req.params.room_id;
    const activity_id = req.params.activity_id;

    RoomsActivities.getOne(room_id, activity_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create room activity */
router.post('/', (req, res, next) => {
    const { room_id, activity_id } = req.body;
    const newRoomActivity = new RoomsActivities(room_id, activity_id);

    RoomsActivities.create(newRoomActivity, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
