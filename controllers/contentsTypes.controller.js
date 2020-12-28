const {QueryTypes} = require("sequelize");
const lodash = require('lodash');

const ContentsTypes = require('../models/ContentsTypes');

const getAllContentType = result => {
  ContentsTypes.findAll({type: QueryTypes.SELECT})
    .then(contentsTypes => result(null, contentsTypes))
    .catch(err => result(err));
};

const getOneContentType = (content_type_id, result) => {
  ContentsTypes.findOne({
    type: QueryTypes.SELECT,
    where: {
      id: content_type_id
    }
  },)
    .then(contentType => {
      if (lodash.isEmpty(contentType))
        result({notification: 'Not available ID.'});
      else
        result(null, contentType)
    })
    .catch(err => result(err));
};

const createContentType = (newContentType, result) => {
  ContentsTypes.create(newContentType, {returning: true})
    .then(contentType => {
      if (lodash.isEmpty(contentType))
        result({notification: 'Not available ID.'});
      else
        result(null, contentType)
    })
    .catch(err => result(err));
};

const updateContentType = (content_type_id, updateValues, result) => {
  ContentsTypes.update(updateValues, {
    where: {
      id: content_type_id
    },
    returning: true,
  }).then(([status, [updatedContentType]]) => {
    if (status === 1)
      result(null, updatedContentType)
    else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))
};

const deleteContentType = (content_type_id, result) => {
  ContentsTypes.destroy({
    where: {
      id: content_type_id
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
  getAllContentType,
  getOneContentType,
  createContentType,
  updateContentType,
  deleteContentType
}
