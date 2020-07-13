const express = require('express');
const router = express.Router();

const Authentication = require('../helpers/authentication');

/* Services end points */
router.get('/', (req, res, next) => {
    res.json(
        {
            login: {
                end_point: '/login',
                request_type: 'post',
                post_variable: 'username, password',
                response_variable: 'encrypted key'
            }
        }
    );
});

/* User login */
router.post('/login', (req, res, next) => {

    const { username, password } = req.body;
    Authentication.login( username, password, (error, result) => {
        if(error)
            res.json(error);
        else {
            res.json(result);
        }
    })

});

module.exports = router;
