const express = require('express');
const router = express.Router();

const {
  getAllFriend,
  getAllOneUserFriends,
  getOneFriend,
  createFriend,
  updateFriend,
  deleteFriend
} = require('../controllers/friends.controller');

/* GET all Friends */
router.get('/', (req, res) => {
  getAllFriend((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET one user all Friends */
router.get('/user/:user_id', (req, res) => {
  const {user_id} = req.params;

  getAllOneUserFriends(user_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET by requester_id and recipient_id Friends */
router.get('/:friend_record_id', (req, res) => {
  const {friend_record_id} = req.params;

  getOneFriend(friend_record_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Add Friend */
router.post('/', (req, res) => {
  const newFriend = req.body;

  createFriend(newFriend, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Accept Friend */
router.put('/:friend_record_id', (req, res) => {
  const {friend_record_id} = req.params;

  const updateValues = req.body;
  updateValues['updated_at'] = new Date().toISOString();

  updateFriend(friend_record_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Reject Friend */
router.delete('/:friend_record_id', (req, res) => {
  const {friend_record_id} = req.params;

  deleteFriend(friend_record_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
