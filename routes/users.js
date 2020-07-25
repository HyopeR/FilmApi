const express = require('express');
const router = express.Router();

const Users = require('../models/Users');

/* GET all users */
router.get('/', (req, res, next) => {
    Users.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET all active users */
router.get('/active', (req, res, next) => {
    Users.getAllActive((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET by id user */
router.get('/:user_id', (req, res, next) => {
    const user_id = req.params.user_id;

    Users.getOne(user_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create user */
router.post('/', (req, res, next) => {
    const { username, name, surname, email, password, active } = req.body;
    const newUser = new Users(username, name, surname, email, password, active);

    Users.create(newUser, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update user */
router.put('/:user_id', (req, res, next) => {
    const user_id = req.params.user_id;
    const { username, name, surname, email, password, active } = req.body;
    const newUser = new Users(username, name, surname, email, password, active);

    Users.update(user_id, newUser, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Deactivate User */
router.delete('/:user_id', (req, res, next) => {
    const user_id = req.params.user_id;

    Users.deactivate(user_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
