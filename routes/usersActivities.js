const express = require('express');
const router = express.Router();

const {
  getAllUserActivity,
  getOneUserActivity,
  createUserActivity
} = require('../controllers/usersActivities.controller');

/* GET all users activities */
router.get('/', (req, res) => {
  getAllUserActivity((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET one user ativity */
router.get('/:user_id/:activity_id', (req, res) => {
  const {user_id, activity_id} = req.params;

  getOneUserActivity(user_id, activity_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create user activity */
router.post('/', (req, res) => {
  const newUserActivity = req.body;

  createUserActivity(newUserActivity, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
