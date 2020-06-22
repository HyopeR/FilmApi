const express = require('express');
const router = express.Router();

const Friends = require('../models/Friends');

/* GET all Friends */
router.get('/', (req, res, next) => {
    Friends.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET by requester_id and recipient_id Friends */
router.get('/:requester_id/:recipient_id', (req, res, next) => {
    const requester_id = req.params.requester_id;
    const recipient_id = req.params.recipient_id;

    Friends.getOne(requester_id, recipient_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Add Friend */
router.post('/', (req, res, next) => {
    const { requester_id, recipient_id, status } = req.body;
    const newFriend = new Friends(requester_id, recipient_id, status);

    Friends.create(newFriend, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Accept Friend */
router.put('/:requester_id/:recipient_id', (req, res, next) => {
    const requester_id = req.params.requester_id;
    const recipient_id = req.params.recipient_id;

    // status, created_at = updateFriend
    const updateFriend = req.body;
    updateFriend['updated_at'] = new Date().toISOString();

    Friends.update(requester_id, recipient_id, updateFriend, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Reject Friend */
router.delete('/:requester_id/:recipient_id', (req, res, next) => {
    const requester_id = req.params.requester_id;
    const recipient_id = req.params.recipient_id;

    Friends.delete(requester_id, recipient_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
