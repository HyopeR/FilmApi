const express = require('express');
const router = express.Router();

const {
  getAllContent,
  getAllActiveContent,
  getOneContent,
  getFilterTypeContent,
  getFilterCategoryContent,
  getFilterSpecialContent,
  createContent,
  updateContent,
  deactivateContent,
  deleteContent
} = require('../controllers/contents.controller');

/* GET all contents */
router.get('/', (req, res) => {
  getAllContent((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET all active contents */
router.get('/active', (req, res) => {
  getAllActiveContent((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});


/* GET by id content */
router.get('/:content_id', (req, res) => {
  const {content_id} = req.params;

  getOneContent(content_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET one type contents -> Dizi or film */
router.get('/change/type/:content_type_id', (req, res) => {
  const {content_type_id} = req.params;

  getFilterTypeContent(content_type_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })

});

/* GET one category contents -> Macera, komedi, bilim kurgu vs. */
router.get('/change/category/:category_id', (req, res) => {
  const {category_id} = req.params;

  getFilterCategoryContent(category_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })

});

/* GET one type contents -> (Dizi or film) and (Macera, komedi, bilim kurgu vs.) */
router.get('/change/special/:content_type_id/:category_id', (req, res) => {
  const {content_type_id, category_id} = req.params;

  getFilterSpecialContent(content_type_id, category_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })

});

/* Create content */
router.post('/', (req, res) => {
  const newContent = req.body;

  createContent(newContent, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update content */
router.put('/:content_id', (req, res) => {
  const {content_id} = req.params;
  const updateValues = req.body;

  updateContent(content_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Deactivate content */
router.delete('/deactivate/:content_id', (req, res) => {
  const {content_id} = req.params;

  deactivateContent(content_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete content */
router.delete('/:content_id', (req, res) => {
  const {content_id} = req.params;

  deleteContent(content_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
