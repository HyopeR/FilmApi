const express = require('express');
const router = express.Router();

const {
  getAllActivity,
  getAllActiveActivity,
  getOneActivity,
  createActivity,
  updateActivity,
  deactivateActivity,
  deleteActivity,
  getAllFilterScores,
  getAllFilterComments
} = require('../controllers/activities.controller');

/* GET all activities */
router.get('/', (req, res) => {
  getAllActivity((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET all active activities */
router.get('/active', (req, res) => {
  getAllActiveActivity((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET by id user_id and content_detail_id one activity get page */
router.get('/:user_id/:content_detail_id', (req, res) => {
  const {user_id, content_detail_id} = req.params;

  getOneActivity(user_id, content_detail_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create activity */
router.post('/', (req, res) => {
  const newActivity = req.body;

  createActivity(newActivity, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update activity */
router.put('/:activity_id', (req, res) => {
  const {activity_id} = req.params;

  const updateValues = req.body;
  updateValues['updated_at'] = new Date().toISOString();

  updateActivity(activity_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Deactivate activity */
router.delete('/deactivate/:activity_id', (req, res) => {
  const {activity_id} = req.params;

  deactivateActivity(activity_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete activity */
router.delete('/:activity_id', (req, res) => {
  const {activity_id} = req.params;

  deleteActivity(activity_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Filter friend activity list scores get method */
router.get('/scores/:user_id/:limit_number', (req, res) => {
  const {user_id, limit_number} = req.params;

  getAllFilterScores(user_id, limit_number, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Filter friend activity list comments get method */
router.get('/comments/:user_id/:limit_number', (req, res) => {
  const {user_id, limit_number} = req.params;

  getAllFilterComments(user_id, limit_number, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});


module.exports = router;
