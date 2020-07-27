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

/* GET one user all Friends */
router.get('/user/:user_id', (req, res, next) => {
    const user_id = req.params.user_id;
    Friends.getAllOneUserFriends(user_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET by requester_id and recipient_id Friends */
router.get('/:friend_record_id', (req, res, next) => {
    const friend_record_id = req.params.friend_record_id;

    Friends.getOne(friend_record_id, (error, result) => {
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
router.put('/:friend_record_id', (req, res, next) => {
    const friend_record_id = req.params.friend_record_id;

    // status, updated_at = updateFriend
    const updateFriend = req.body;
    updateFriend['updated_at'] = new Date().toISOString();

    Friends.update(friend_record_id, updateFriend, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Reject Friend */
router.delete('/:friend_record_id', (req, res, next) => {
    const friend_record_id = req.params.friend_record_id;

    Friends.delete(friend_record_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
