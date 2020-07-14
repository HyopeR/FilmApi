const express = require('express');
const router = express.Router();

const Services = require('../helpers/services');

/* Services end points */
router.get('/', (req, res, next) => {
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
router.post('/video/vidmoly', (req, res, next) => {

    const { url } = req.body;
    Services.getMp4(url, (error, result) => {
        if(error)
            res.json(error);
        else {
            res.json(result);
        }
    })

});

module.exports = router;
