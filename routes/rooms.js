const express = require('express');
const router = express.Router();

const {
  getAllRoom,
  getOneRoom,
  createRoom,
  updateRoom,
  deactivateRoom,
  deleteRoom
} = require('../controllers/rooms.controller');

/* GET all rooms */
router.get('/', (req, res) => {
  getAllRoom((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET by id room */
router.get('/:room_id', (req, res) => {
  const {room_id} = req.params;

  getOneRoom(room_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create room */
router.post('/', (req, res) => {
  const newRoom = req.body;

  createRoom(newRoom, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update room */
router.put('/:room_id', (req, res) => {
  const {room_id} = req.params;
  const updateValues = req.body;

  updateRoom(room_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Deactivate room */
router.delete('/deactivate/:room_id', (req, res) => {
  const {room_id} = req.params;

  deactivateRoom(room_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete room */
router.delete('/:room_id', (req, res) => {
  const {room_id} = req.params;

  deleteRoom(room_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
