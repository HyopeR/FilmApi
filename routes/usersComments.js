const express = require('express');
const router = express.Router();

const UsersComments = require('../models/UsersComments');

/* GET all users commets */
router.get('/', (req, res, next) => {
    UsersComments.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET by content_detail_id all comments */
router.get('/content/detail/:content_detail_id/:limit_number', (req, res, next) => {
    const content_detail_id = req.params.content_detail_id;
    const limit_number = req.params.limit_number;

    UsersComments.getAllContentDetailComments(content_detail_id, limit_number, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET by id users comment row */
router.get('/:user_comment_id', (req, res, next) => {
    const user_comment_id = req.params.user_comment_id;

    UsersComments.getOne(user_comment_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create users comment */
router.post('/', (req, res, next) => {
    const { user_id, content_detail_id, detail } = req.body;
    const newUserComment = new UsersComments(user_id, content_detail_id, detail);

    UsersComments.create(newUserComment, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update users comment detail */
router.put('/:user_comment_id', (req, res, next) => {
    const user_comment_id = req.params.user_comment_id;

    const { detail } = req.body;
    const updateUserComment = { detail: detail };
    updateUserComment['updated_at'] = new Date().toISOString();

    UsersComments.update(user_comment_id, updateUserComment, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Delete users comment row */
router.delete('/:user_comment_id', (req, res, next) => {
    const user_comment_id = req.params.user_comment_id;

    UsersComments.delete(user_comment_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
