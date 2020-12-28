const express = require('express');
const router = express.Router();

const {getVidmolyMp4} = require('../controllers/services.controller');

/* Services end points */
router.get('/', (req, res) => {
    res.json(
        {
            vidmoly: {
                end_point: '/video/vidmoly',
                request_type: 'post',
                post_variable: 'url',
                response_variable: 'mp4'
            }
        }
    );
});

/* GET mp4 videos */
router.post('/video/vidmoly', (req, res) => {
    const { url } = req.body;

    getVidmolyMp4(url, (error = null, result = null) => {
        if (error)
            res.status(400).json(error);
        else
            res.status(200).json(result);
    })

});

module.exports = router;
