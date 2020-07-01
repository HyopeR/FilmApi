const express = require('express');
const router = express.Router();

const Rooms = require('../models/Rooms');

/* GET all rooms */
router.get('/', (req, res, next) => {
    Rooms.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});


/* GET by id room */
router.get('/:room_id', (req, res, next) => {
    const room_id = req.params.room_id;
    Rooms.getOne(room_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create room */
router.post('/', (req, res, next) => {
    const { name, active } = req.body;
    const newRoom = new Rooms(name, active);

    Rooms.create(newRoom, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update room */
router.put('/:room_id', (req, res, next) => {
    const room_id = req.params.room_id;
    const { name, active } = req.body;
    const newRoom = new Rooms(name, active);

    Rooms.update(room_id, newRoom, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Deactivate room */
router.delete('/:room_id', (req, res, next) => {
    const room_id = req.params.room_id;
    Rooms.deactivate(room_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
