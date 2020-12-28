const {
  createUsersScore, deleteUsersScore,
  getAllUsersScore,
  getContentMeanScore,
  getOneUsersScore, updateUsersScore
} = require('../controllers/usersScores.controller');

const express = require('express');
const router = express.Router();

const UsersScores = require('../models/UsersScores');

/* GET all users scores */
router.get('/', (req, res) => {
  getAllUsersScore((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET one content's mean users scores */
router.get('/content/:content_id', (req, res) => {
  const {content_id} = req.params;

  getContentMeanScore(content_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});


/* GET by id users scores row */
router.get('/:user_id/:content_id', (req, res) => {
  const {user_id, content_id} = req.params;

  getOneUsersScore(user_id, content_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create users scores */
router.post('/', (req, res) => {
  const newUserScore = req.body;

  createUsersScore(newUserScore, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update users scores score */
router.put('/:user_id/:content_id', (req, res) => {
  const {user_id, content_id} = req.params;

  const updateValues = req.body;
  updateValues['updated_at'] = new Date().toISOString();

  updateUsersScore(user_id, content_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete users room row */
router.delete('/:user_id/:content_id', (req, res) => {
  const {user_id, content_id} = req.params;

  deleteUsersScore(user_id, content_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
