const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const Authentication = require('../helpers/authentication');
const Register = require('../helpers/register');

/* Services end points */
router.get('/', (req, res, next) => {
    res.json(
        {
            login: {
                end_point: '/login',
                request_type: 'post',
                post_variable: 'username, password',
                response_variable: 'x-access-token'
            },
            register: {
                end_point: '/register',
                request_type: 'post',
                post_variable: 'username, name, surname, email, password, active',
                response_variable: 'user record data'
            }
        },
    );
});

/* add new colon */
router.post('/add', (req, res, next) => {

    Authentication.add((error, result) => {
        if(error)
            res.json(error);
        else
            res.json(result);
    });
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

/* Register User */
router.post('/register', (req, res, next) => {
    const { username, name, surname, email, password, active } = req.body;

    let verification;
    let splitEmail = email.split('@')[1];
    const permittedEmails = ['gmail.com', 'hotmail.com', 'outlook.com'];

    if (permittedEmails.includes(splitEmail))
        verification = true;
    else
        verification = false;

    if (verification) {
        const newUser = new Register(username, name, surname, email, password, active);

        Register.register(newUser, (error, result) => {
            if(error)
                res.json(error);
            else
                res.json(result);
        })
    } else {
        res.json({notification: 'Permitted e-mail addresses; `gmail.com` or `hotmail.com`'});
    }
});

module.exports = router;
