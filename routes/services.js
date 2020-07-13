const express = require('express');
const router = express.Router();

const Services = require('../helpers/Services');

/* GET mp4 videos */
router.post('/video', (req, res, next) => {

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
