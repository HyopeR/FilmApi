const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const {userRegister, userLogin} = require('../controllers/authentication.controller');

/* Services end points */
router.get('/', (req, res) => {
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

/* User login */
router.post('/login', (req, res) => {
  const {username, password} = req.body;

  userLogin(username, password, (error, result) => {
    if (error)
      res.status(400).json(error);
    else {
      const payload = {username};
      jwt.sign(payload, req.app.get('api_secret_key'), {
        expiresIn: 720 // 12 saat.
      })
        .then(token => res.status(200).json({status: result.status, token}))
        .catch(err => res.status(400).json(err))
    }
  })

});

/* Register User */
router.post('/register', (req, res) => {
  const newUser = req.body;

  userRegister(newUser, (error = null, result = null) => {
    if (error)
      res.status(400).json(error);
    else
      res.status(200).json(result);
  })

});

module.exports = router;
