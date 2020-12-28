const {QueryTypes} = require("sequelize");
const lodash = require('lodash');

const Categories = require('../models/Categories');

const getAllCategory = result => {
  Categories.findAll({type: QueryTypes.SELECT})
    .then(categories => result(null, categories))
    .catch(err => result(err));
};

const getOneCategory = (category_id, result) => {

  Categories.findOne({type: QueryTypes.SELECT, where: {id: category_id}},)
    .then(category => {
      if (lodash.isEmpty(category))
        result({notification: 'Not available ID.'});
      else
        result(null, category)
    })
    .catch(err => result(err));
};

const createCategory = (newCategory, result) => {

  Categories.create(newCategory, {returning: true})
    .then(category => {
      if (lodash.isEmpty(category))
        result({notification: 'Not available ID.'});
      else
        result(null, category)
    })
    .catch(err => result(err));
};

const updateCategory = async (category_id, updateValues, result) => {

  const transAction = await db.transaction();

  Categories.update(updateValues, {
    where: {
      id: category_id
    },
    returning: true,
    transaction: transAction,
  }).then(([status, [updatedCategory]]) => {
    if (status === 1)
      result(null, updatedCategory)
    else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))
};

const deleteCategory = (category_id, result) => {

  Categories.destroy({
    where: {
      id: category_id
    },
    returning: true,
  })
    .then(data => {
      if (data === 1)
        result(null, {success: true})
      else
        result({notification: 'Delete failed.'})
    })
    .catch(err => result(err))
};

module.exports = {
  getAllCategory,
  getOneCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
