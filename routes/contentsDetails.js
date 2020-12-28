const express = require('express');
const router = express.Router();

const {
  getAllContentDetail,
  getOneContentDetail,
  getOneContentsAllDetails,
  createContentDetail,
  updateContentDetail,
  deleteContentDetail
} = require('../controllers/contentsDetails.controller');

/* GET all content detail */
router.get('/', (req, res) => {
  getAllContentDetail((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET by id content detail */
router.get('/:content_detail_id', (req, res) => {
  const {content_detail_id} = req.params;

  getOneContentDetail(content_detail_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET with content_id all episodes and seasons data */
router.get('/series/:content_id', (req, res) => {
  const {content_id} = req.params;

  getOneContentsAllDetails(content_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Create content detail */
router.post('/', (req, res) => {
  const newContentDetail = req.body;

  createContentDetail(newContentDetail, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update content detail */
router.put('/:content_detail_id', (req, res) => {
  const {content_detail_id} = req.params;
  const updateValues = req.body;

  updateContentDetail(content_detail_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete content detail */
router.delete('/:content_detail_id', (req, res) => {
  const {content_detail_id} = req.params;

  deleteContentDetail(content_detail_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
