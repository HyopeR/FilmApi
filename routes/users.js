const express = require('express');
const router = express.Router();

const User = require('../models/User');

/* GET all users. */
router.get('/', (req, res, next) => {
  const promise = User.find()
      .populate({ path: 'friends'})
      .populate({ path: 'lists' })
      .populate({ path: 'rooms' });

  promise.then((data) => {
    res.json(data);
  }).catch((error) => {
    res.json(error);
  });

});

/* GET one user. */
router.get('/:user_id', (req, res, next) => {
  const promise = User.find({ _id: req.params.id })
      .populate({ path: 'friends' })
      .populate({ path: 'lists' })
      .populate({ path: 'rooms' });

  promise.then((data) => {
    res.json(data);
  }).catch((error) => {
    res.json(error);
  });
});

/* POST user. */
router.post('/', (req, res, next) => {
  const user = new User(req.body);
  const promise = user.save();

  promise.then((data) => {
    res.json(data);
  }).catch((error) => {
    res.json(error);
  });
});

/* PUT user. */
router.put('/:user_id', (req, res, next) => {
  const promise = User.findByIdAndUpdate(
      req.params.user_id,
      req.body,
      {
        new: true
      }
  );

  promise.then((user) => {
    res.json(user);
  }).catch((error) => {
    res.json(error);
  });
});

/* DELETE user. */
router.delete('/:user_id', (req, res, next) => {
  const promise = User.findByIdAndRemove(req.params.user_id);

  promise.then((user) => {
    res.json(user);
  }).catch((error) => {
    res.json(error);
  });
});

module.exports = router;
