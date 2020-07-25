const express = require('express');
const router = express.Router();

const UsersRooms = require('../models/UsersRooms');

/* GET all users room */
router.get('/', (req, res, next) => {
    UsersRooms.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET all room in users list */
router.get('/userlist/:room_id', (req, res, next) => {
    const room_id = req.params.room_id;

    UsersRooms.getOneRoomUsers(room_id,(error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET all user in rooms list */
router.get('/roomlist/:user_id', (req, res, next) => {
    const user_id = req.params.user_id;

    UsersRooms.getOneUserRooms(user_id,(error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET by id users room row */
router.get('/:user_id/:room_id', (req, res, next) => {
    const user_id = req.params.user_id;
    const room_id = req.params.room_id;

    UsersRooms.getOne(user_id, room_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create users room */
router.post('/', (req, res, next) => {
    const { user_id, room_id, authority } = req.body;
    const newUserRoom = new UsersRooms(user_id, room_id, authority);

    UsersRooms.create(newUserRoom, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update users room authority */
router.put('/:user_id/:room_id', (req, res, next) => {
    const user_id = req.params.user_id;
    const room_id = req.params.room_id;

    const { authority } = req.body;
    const updateUserRoom = { authority: authority };

    UsersRooms.update(user_id, room_id, updateUserRoom, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Delete users room row */
router.delete('/:user_id/:room_id', (req, res, next) => {
    const user_id = req.params.user_id;
    const room_id = req.params.room_id;

    UsersRooms.delete(user_id, room_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
