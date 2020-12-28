const {QueryTypes} = require("sequelize");
const lodash = require('lodash');

const ContentsCategories = require('../models/ContentsCategories');
const db = require('../helpers/db');

const getAllContentCategory = result => {
  let query = `SELECT
        puppet_contents_category.content_id,
        contents.tr_name,
        contents.eng_name,
        array_agg( json_build_object ( 
            'category_id', categories.id,
            'category_name', categories.name 
        )) as categories

    FROM contents
        LEFT JOIN  (SELECT *
        FROM contents_categories
        ORDER BY category_id) AS puppet_contents_category
        ON contents.id = puppet_contents_category.content_id
        LEFT JOIN categories
        ON puppet_contents_category.category_id = categories.id

    GROUP BY
        puppet_contents_category.content_id,
        contents.tr_name,
        contents.eng_name`;

  db.query(query, { type: QueryTypes.SELECT })
    .then(contentsCategories => result(null, contentsCategories))
    .catch(err => result(err));
};

const getOneContentCategory = (content_id, result) => {
  let query = `SELECT
        puppet_contents_category.content_id,
        contents.tr_name,
        contents.eng_name,
        array_agg( json_build_object ( 
            'category_id', categories.id,
            'category_name', categories.name 
        )) as categories

    FROM contents
        LEFT JOIN  (SELECT *
        FROM contents_categories
        ORDER BY category_id) AS puppet_contents_category
        ON contents.id = puppet_contents_category.content_id
        LEFT JOIN categories
        ON puppet_contents_category.category_id = categories.id
        
    WHERE puppet_contents_category.content_id = ${content_id}

    GROUP BY
        puppet_contents_category.content_id,
        contents.tr_name,
        contents.eng_name`;

  db.query(query, { type: QueryTypes.SELECT })
    .then(contentCategory => {
      if(lodash.isEmpty(contentCategory))
        result({notification: 'Not available ID.'});
      else
        result(null, lodash.head(contentCategory));
    })
    .catch(err => result(err));
};

const createContentCategory = (newContentCategory, result) => {

  ContentsCategories.create(newContentCategory, {
    returning: true
  })
    .then(contentCategory => {
      if (lodash.isEmpty(contentCategory))
        result({notification: 'Adding failed.'});
      else
        result(null, contentCategory)
    })
    .catch(err => result(err));

};

const updateContentCategory = (content_id, category_id, updateValues, result) => {

   ContentsCategories.update(updateValues, {
    where: {
      content_id: content_id,
      category_id: category_id
    },
    returning: true,
  }).then(([status, [updatedContentCategory]]) => {
    if (status === 1)
      result(null, updatedContentCategory)
    else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))

};

const deleteContentCategory = (content_id, category_id, result) => {

  ContentsCategories.destroy({
    where: {
      content_id: content_id,
      category_id: category_id
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
  getAllContentCategory,
  getOneContentCategory,
  createContentCategory,
  updateContentCategory,
  deleteContentCategory
}
