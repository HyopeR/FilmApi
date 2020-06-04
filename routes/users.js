const express = require('express');
const router = express.Router();

/* GET all users. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
