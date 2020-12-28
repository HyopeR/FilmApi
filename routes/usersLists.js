const express = require('express');
const router = express.Router();

const {
  getAllUserList,
  getOneUserList,
  addListItem,
  deleteListItem
} = require('../controllers/usersLists.controller');

/* GET all users lists */
router.get('/', (req, res) => {
  getAllUserList((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET by user_id lists */
router.get('/:user_id', (req, res) => {
  const {user_id} = req.params;

  getOneUserList(user_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create list item */
router.post('/', (req, res) => {
  const newUserListItem = req.body;

  addListItem(newUserListItem, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete list item */
router.delete('/:user_id/:content_id', (req, res) => {
  const {user_id, content_id} = req.params;

  deleteListItem(user_id, content_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
