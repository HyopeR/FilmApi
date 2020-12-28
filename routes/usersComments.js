const express = require('express');
const router = express.Router();

const {
  getAllUserComment,
  getAllContentDetailComments,
  getOneUserComment,
  createUserComment,
  updateUserComment,
  deleteUserComment
} = require('../controllers/usersComments.controller');

/* GET all users commets */
router.get('/', (req, res) => {
  getAllUserComment((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET by content_detail_id all comments */
router.get('/content/detail/:content_detail_id/:limit_number', (req, res) => {
  const {content_detail_id, limit_number} = req.params;

  getAllContentDetailComments(content_detail_id, limit_number, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET by id users comment row */
router.get('/:user_comment_id', (req, res) => {
  const {user_comment_id} = req.params;

  getOneUserComment(user_comment_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create users comment */
router.post('/', (req, res) => {
  const newUserComment = req.body;

  createUserComment(newUserComment, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update users comment detail */
router.put('/:user_comment_id', (req, res) => {
  const {user_comment_id} = req.params;

  const updateValues = req.body;
  updateValues['updated_at'] = new Date().toISOString();

  updateUserComment(user_comment_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete users comment row */
router.delete('/:user_comment_id', (req, res) => {
  const {user_comment_id} = req.params;

  deleteUserComment(user_comment_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
