const express = require('express');
const router = express.Router();

const {
  getAllUserRoom,
  getOneRoomUserList,
  getOneUserRoomList,
  getOneUserRoom,
  createUserRoom,
  updateUserRoom,
  deleteUserRoom
} = require('../controllers/usersRooms.controller');

/* GET all users room */
router.get('/', (req, res) => {
  getAllUserRoom((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET all room in users list */
router.get('/userlist/:room_id', (req, res) => {
  const {room_id} = req.params;

  getOneRoomUserList(room_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET all user in rooms list */
router.get('/roomlist/:user_id', (req, res) => {
  const {user_id} = req.params;

  getOneUserRoomList(user_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET by id users room row */
router.get('/:user_id/:room_id', (req, res) => {
  const {user_id, room_id} = req.params;

  getOneUserRoom(user_id, room_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create users room */
router.post('/', (req, res) => {
  const newUserRoom = req.body;

  createUserRoom(newUserRoom, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update users room authority */
router.put('/:user_id/:room_id', (req, res) => {
  const {user_id, room_id} = req.params;
  const updateValues = req.body;

  updateUserRoom(user_id, room_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete users room row */
router.delete('/:user_id/:room_id', (req, res) => {
  const {user_id, room_id} = req.params;

  deleteUserRoom(user_id, room_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
