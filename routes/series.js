const express = require('express');
const router = express.Router();

const {
  getAllSeries,
  getOneSeries,
  getContentAllSeason,
  getContentOneSeason,
  createSeries,
  updateSeries,
  deleteSeries
} = require('../controllers/series.controller');

/* GET all series */
router.get('/', (req, res, next) => {
  getAllSeries((error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});


/* GET by id series */
router.get('/:series_id', (req, res, next) => {
  const {series_id} = req.params;

  getOneSeries(series_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* GET one content all season episode */
router.get('/allSeason/:content_id', (req, res, next) => {
  const {content_id} = req.params;

  getContentAllSeason(content_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })

});

/* GET one content one season episode */
router.get('/oneSeason/:content_id/:series_season', (req, res, next) => {
  const {content_id, series_season} = req.params;

  getContentOneSeason(content_id, series_season, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })

});

/* Create series */
router.post('/', (req, res, next) => {
  const newEpisode = req.body;

  createSeries(newEpisode, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Update series */
router.put('/:series_id', (req, res, next) => {
  const {series_id} = req.params;
  const updateValues = req.body;

  updateSeries(series_id, updateValues, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

/* Delete series */
router.delete('/:series_id', (req, res, next) => {
  const {series_id} = req.params;

  deleteSeries(series_id, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })
});

module.exports = router;
