const express = require('express');
const router = express.Router();

const {getAllActiveUser, getAllUser, getOneUser, updateUser, deactivateUser, deleteUser} = require('../controllers/users.controller');

/* GET all users */
router.get('/', (req, res) => {
    getAllUser((error = null, result = null) => {
        if(error)
            res.status(400).json(error);
        else
            res.status(200).json(result);
    })
});

/* GET all active users */
router.get('/active', (req, res) => {
    getAllActiveUser((error = null, result = null) => {
        if(error)
            res.status(400).json(error);
        else
            res.status(200).json(result);
    })
});

/* GET by id user */
router.get('/:user_id', (req, res) => {
    const {user_id} = req.params;

    getOneUser(user_id, (error = null, result = null) => {
        if(error)
            res.status(400).json(error);
        else
            res.status(200).json(result);
    })
});

/* Update user */
router.put('/:user_id', (req, res) => {
    const {user_id} = req.params;
    const updateValues = req.body;

    updateUser(user_id, updateValues, (error = null, result = null) => {
        if(error)
            res.status(400).json(error);
        else
            res.status(200).json(result);
    })
});

/* Deactivate User */
router.delete('/deactivate/:user_id', (req, res) => {
    const {user_id} = req.params;

    deactivateUser(user_id, (error = null, result = null) => {
        if(error)
            res.status(400).json(error);
        else
            res.status(200).json(result);
    })
});

/* Delete User */
router.delete('/:user_id', (req, res) => {
    const {user_id} = req.params;

    deleteUser(user_id, (error = null, result = null) => {
        if(error)
            res.status(400).json(error);
        else
            res.status(200).json(result);
    })
});

module.exports = router;
