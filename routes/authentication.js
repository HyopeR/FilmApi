const express = require('express');
const jwt = require('jsonwebtoken');

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
                response_variable: 'x-access-token'
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

        if(result.status) {
            const payload = {
                username
            };
            const token = jwt.sign(payload, req.app.get('api_secret_key'), {
                expiresIn: 720 // 12 saat.
            });
            res.json({status: result.status, token});
        } else {
            res.json(result);
        }
    })

});

module.exports = router;
