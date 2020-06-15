const express = require('express');
const router = express.Router();

const ContentsDetails = require('../models/ContentsDetails');

/* GET all content detail */
router.get('/', (req, res, next) => {
    ContentsDetails.getAll((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});


/* GET by id content detail */
router.get('/:id', (req, res, next) => {
    const content_detail_id = req.params.id;
    ContentsDetails.getOne(content_detail_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Create content detail */
router.post('/', (req, res, next) => {
    const { content_id, series_id, url, time, intro_start_time, intro_finish_time } = req.body;
    const newContentDetail = new ContentsDetails(content_id, series_id, url, time, intro_start_time, intro_finish_time );

    ContentsDetails.create(newContentDetail, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Update content detail */
router.put('/:id', (req, res, next) => {
    const content_detail_id = req.params.id;
    const { content_id, series_id, url, time, intro_start_time, intro_finish_time } = req.body;
    const newContentDetail = new ContentsDetails(content_id, series_id, url, time, intro_start_time, intro_finish_time );

    ContentsDetails.update(content_detail_id, newContentDetail, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

/* Delete content detail */
router.delete('/:id', (req, res, next) => {
    const content_detail_id = req.params.id;
    ContentsDetails.delete(content_detail_id, (error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    })
});

module.exports = router;
