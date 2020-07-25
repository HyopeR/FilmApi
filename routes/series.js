const express = require('express');
const router = express.Router();

const Series = require('../models/Series');

/* GET all series */
router.get('/', (req, res, next) => {
    Series.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});


/* GET by id series */
router.get('/:series_id', (req, res, next) => {
    const series_id = req.params.series_id;
    Series.getOne(series_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* GET one content all season episode */
router.get('/allSeason/:content_id', (req, res, next) => {

    const content_id = req.params.content_id;
    Series.getContentAllSeason(content_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })

});

/* GET one content one season episode */
router.get('/oneSeason/:content_id/:series_season', (req, res, next) => {

    const {content_id, series_season} = req.params;
    Series.getContentOneSeason(content_id, series_season, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })

});

/* Create series */
router.post('/', (req, res, next) => {
    const { content_id, series_season, tr_episode_name, eng_episode_name, episode_number } = req.body;
    const newEpisode = new Series(content_id, series_season, tr_episode_name, eng_episode_name, episode_number);

    Series.create(newEpisode, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update series */
router.put('/:series_id', (req, res, next) => {
    const series_id = req.params.series_id;
    const { content_id, series_season, tr_episode_name, eng_episode_name, episode_number } = req.body;
    const newEpisode = new Series(content_id, series_season, tr_episode_name, eng_episode_name, episode_number);

    Series.update(series_id, newEpisode, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Delete series */
router.delete('/:series_id', (req, res, next) => {
    const series_id = req.params.series_id;
    Series.delete(series_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
