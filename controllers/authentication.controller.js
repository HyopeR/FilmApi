const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const bcrypt = require('bcryptjs');

const Users = require('../models/Users');
const {controlEmail} = require('../helpers/regexControls');

const userRegister = async (newUser, result) => {
  let keys = lodash.keys(newUser);

  if (!keys.includes('username'))
    return result({notification: 'Username is required.'});
  if (!keys.includes('password'))
    return result({notification: 'Password is required.'});
  if (!keys.includes('email'))
    return result({notification: 'Email is required.'});
  if (!controlEmail(newUser.email))
    return result({notification: 'Email is invalid.'});

  newUser.password = await bcrypt.hash(newUser.password, 10);

  Users.create(newUser, {
    returning: true
  })
    .then(user => {
      if (lodash.isEmpty(user))
        return result({notification: 'Adding failed.'});
      else
        result(null, user)
    })
    .catch(err => result(err));
};

const userLogin = async (username, password, result) => {
  if (!username || !password)
    return result({notification: 'Username and password is required.'})

  const queryUser = await Users.findOne({
    type: QueryTypes.SELECT,
    where: {
      username: username
    }
  })

  if (lodash.isEmpty(queryUser))
    return result({notification: 'User not found.'});

  const verification = await bcrypt.compare(password, queryUser.password)
  if (!verification)
    return result({notification: 'Password incorrect.'});

  result(null, queryUser);
};

module.exports = {
  userRegister,
  userLogin
}
