const express = require('express');
const router = express.Router();

const {
  getAllContentType,
  getOneContentType,
  createContentType,
  updateContentType,
  deleteContentType
} = require('../controllers/contentsTypes.controller');

/* GET all content types */
router.get('/', (req, res) => {
  getAllContentType((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});


/* GET by id content type */
router.get('/:content_type_id', (req, res) => {
  const {content_type_id} = req.params;

  getOneContentType(content_type_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create content type */
router.post('/', (req, res) => {
  const newContentType = req.body;

  createContentType(newContentType, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update content type */
router.put('/:content_type_id', (req, res) => {
  const {content_type_id} = req.params;
  const updateValues = req.body;

  updateContentType(content_type_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete content type */
router.delete('/:content_type_id', (req, res) => {
  const {content_type_id} = req.params;

  deleteContentType(content_type_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
