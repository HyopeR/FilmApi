const express = require('express');
const router = express.Router();

const {
  getAllCategory,
  getOneCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories.controller');

/* GET all categories */
router.get('/', (req, res) => {
  getAllCategory((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET by id categories */
router.get('/:category_id', (req, res) => {
  const category_id = req.params.category_id;

  getOneCategory(category_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create categories */
router.post('/', (req, res) => {
  const newCategory = req.body;

  createCategory(newCategory, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update categories */
router.put('/:category_id', (req, res) => {
  const category_id = req.params.category_id;
  const updateValues = req.body;

  updateCategory(category_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete categories */
router.delete('/:category_id', (req, res) => {
  const category_id = req.params.category_id;

  deleteCategory(category_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
