const express = require('express');
const router = express.Router();

const {
  getAllRoomActivity,
  getOneRoomActivity,
  createRoomActivity
} = require('../controllers/roomsActivities.controller');

/* GET all rooms activities */
router.get('/', (req, res) => {
  getAllRoomActivity((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET one rooms activity */
router.get('/:room_id/:activity_id', (req, res) => {
  const {room_id, activity_id} = req.params;

  getOneRoomActivity(room_id, activity_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create room activity */
router.post('/', (req, res) => {
  const newRoomActivity = req.body;

  createRoomActivity(newRoomActivity, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
