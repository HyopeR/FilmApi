const express = require('express');
const router = express.Router();

const UsersLists = require('../models/UsersLists');

/* GET all users lists */
router.get('/', (req, res, next) => {
    UsersLists.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET by user_id lists */
router.get('/:user_id', (req, res, next) => {

    const user_id = req.params.user_id;
    UsersLists.getOne(user_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create list item */
router.post('/', (req, res, next) => {
    const { user_id, content_id } = req.body;
    const newUserList = new UsersLists(user_id, content_id);

    UsersLists.create(newUserList, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Delete list item */
router.delete('/:user_id/:content_id', (req, res, next) => {

    const user_id = req.params.user_id;
    const content_id = req.params.content_id;

    UsersLists.delete(user_id, content_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
