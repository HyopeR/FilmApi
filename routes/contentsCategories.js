const express = require('express');
const router = express.Router();

const {
  getAllContentCategory,
  getOneContentCategory,
  createContentCategory,
  updateContentCategory,
  deleteContentCategory
} = require('../controllers/contentsCategories.controller');

/* GET all content categories */
router.get('/', (req, res) => {
  getAllContentCategory((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});


/* GET by id content category */
router.get('/:content_id', (req, res) => {
  const {content_id} = req.params;

  getOneContentCategory(content_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create content category */
router.post('/', (req, res) => {
  const newContentCategory = req.body;

  createContentCategory(newContentCategory, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update content category */
router.put('/:content_id/:category_id', (req, res) => {
  const {content_id, category_id} = req.params;
  const updateValues = req.body;

  updateContentCategory(content_id, category_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete content category */
router.delete('/:content_id/:category_id', (req, res) => {
  const {content_id, category_id} = req.params;

  deleteContentCategory(content_id, category_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
