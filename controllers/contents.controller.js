const {QueryTypes} = require("sequelize");
const lodash = require('lodash');

const Contents = require('../models/Contents');
const db = require('../helpers/db');

const getQueryRoofDynamic = (parameterString) => {

  return `SELECT 
        contents.id,
        contents.type_id,
        contents_types.type_name,
        contents.tr_name,
        contents.eng_name,
        contents.poster_url,
        contents.imdb_score,
        mean_score.users_mean_score,
        contents.active,
        contents.created_at,
        puppet_episodes.episodes,
        puppet_categories.categories
        
        FROM contents

    LEFT JOIN 
    (
        SELECT 
        contents.id,
        contents.type_id,
        contents.tr_name,
        contents.eng_name,
        contents.imdb_score,
        contents.active,
        contents.created_at,
        json_object_agg ( 
                COALESCE( puppet_contents_details.series_season, 0 ), 
                puppet_contents_details.episodes 
        ) as episodes
        
        FROM contents
        LEFT JOIN
        (
        SELECT contents_details.content_id, puppet_series.series_season,
                array_agg( json_build_object(
                    'content_detail_id', contents_details.id,
                    'series_id', series_id,
                    'url', url,
                    'episode_number', episode_number,
                    'tr_episode_name', tr_episode_name,
                    'eng_episode_name', eng_episode_name,
                    'time', time,
                    'intro_start_time', intro_start_time,
                    'intro_finish_time', intro_finish_time,
                    'created_at', contents_details.created_at
                ) ORDER BY episode_number ASC ) as episodes
                
        FROM contents_details
        LEFT JOIN (
            SELECT * 
            FROM series 
            ORDER BY content_id, series_season, episode_number ASC) as puppet_series
        ON contents_details.series_id = puppet_series.id
        
        GROUP BY 
            contents_details.content_id,
            puppet_series.series_season

        ORDER BY
            puppet_series.series_season DESC
        ) AS puppet_contents_details
    ON contents.id = puppet_contents_details.content_id
    
    GROUP BY
        contents.id,
        contents.type_id,
        contents.tr_name,
        contents.eng_name,
        contents.imdb_score,
        contents.active,
        contents.created_at
    ) AS puppet_episodes
    ON contents.id = puppet_episodes.id
    
    LEFT JOIN 
    (
        SELECT 
            contents.id,
            contents.type_id,
            contents.tr_name,
            contents.eng_name,
            contents.imdb_score,
            contents.active,
            contents.created_at,
            array_agg(
                json_build_object(
                    'category_id', puppet_contents_categories.category_id,
                    'category_name', puppet_contents_categories.name
            )) as categories
        FROM contents
        LEFT JOIN 
        (
        SELECT contents.id as content_id, categories.id as category_id, categories.name
        FROM contents
        
        LEFT JOIN contents_categories
        ON contents.id = contents_categories.content_id
        
        LEFT JOIN categories
        ON contents_categories.category_id = categories.id
        
        LEFT JOIN series
        ON contents.id = series.content_id
        
        GROUP BY contents.id, categories.id, categories.name
        ORDER BY contents.id, categories.id
    ) AS puppet_contents_categories
        ON contents.id = puppet_contents_categories.content_id
        
        GROUP BY
            contents.id,
            contents.type_id,
            contents.tr_name,
            contents.eng_name,
            contents.imdb_score,
            contents.active,
            contents.created_at
        ) AS puppet_categories
    ON contents.id = puppet_categories.id
    
    LEFT JOIN
    (
        SELECT 
            contents.id, 
            CAST ( COALESCE( mean_calculate.users_mean_score, 0 ) AS double precision ) as users_mean_score
        FROM contents
        LEFT JOIN 
            (  
                SELECT content_id, ROUND(AVG(score)::numeric,1) AS users_mean_score
                FROM users_scores
                GROUP BY content_id
            ) as mean_calculate
        ON contents.id = mean_calculate.content_id
    ) AS mean_score
    ON contents.id = mean_score.id
    
    LEFT JOIN contents_types
    ON contents.type_id = contents_types.id
    `
    +
    parameterString
    +
    `
    ORDER BY id
    `;
};

const getAllContent = result => {
  let query = getQueryRoofDynamic(``);

  db.query(query, {type: QueryTypes.SELECT})
    .then(contents => result(null, contents))
    .catch(err => result(err));
};

const getAllActiveContent = result => {
  let query = getQueryRoofDynamic(`WHERE contents.active = true`);

  db.query(query, {type: QueryTypes.SELECT})
    .then(contents => result(null, contents))
    .catch(err => result(err));
};

const getOneContent = (content_id, result) => {
  let query = getQueryRoofDynamic(`WHERE contents.id = ${content_id}`);

  db.query(query, {type: QueryTypes.SELECT})
    .then(content => {
      if (lodash.isEmpty(content))
        result({notification: 'Not available ID.'});
      else
        result(null, lodash.head(content));
    })
    .catch(err => result(err));
};

const getFilterTypeContent = (content_type_id, result) => {
  let query = getQueryRoofDynamic(`WHERE contents.active = true AND contents.type_id = ${content_type_id}`);

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'Not available ID.'});
      else
        result(null, data);
    })
    .catch(err => result(err));
};

const getFilterCategoryContent = (category_id, result) => {
  let query = getQueryRoofDynamic(
    `WHERE contents.active = true
        AND contents.id IN (SELECT content_id FROM contents_categories WHERE category_id = ${category_id})`);

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'Not available ID.'});
      else
        result(null, data);
    })
    .catch(err => result(err));
};

const getFilterSpecialContent = (content_type_id, category_id, result) => {

  let query = getQueryRoofDynamic(
    `WHERE contents.active = true 
        AND contents.type_id = ${content_type_id}
        AND contents.id IN (SELECT content_id FROM contents_categories WHERE category_id = ${category_id})`);

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'Not available ID.'});
      else
        result(null, data);
    })
    .catch(err => result(err));
};

const createContent = (newContent, result) => {

  Contents.create(newContent, {
    returning: true
  })
    .then(content => {
      if (lodash.isEmpty(content))
        result({notification: 'Adding failed.'});
      else
        result(null, content)
    })
    .catch(err => result(err));
};

const updateContent = (content_id, updateValues, result) => {

  Contents.update(updateValues, {
    where: {
      id: content_id
    },
    returning: true,
  }).then(([status, [updatedContent]]) => {
    if (status === 1)
      result(null, updatedContent)
    else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))
};

const deactivateContent = (content_id, result) => {
  Contents.update({active: false}, {
    where: {
      id: content_id
    },
    returning: true,
  }).then(([status, [updatedContent]]) => {
    if (status === 1) {
      result(null, updatedContent)
    } else
      result({notification: 'Deactivated failed.'})
  })
    .catch(err => result(err))
};

const deleteContent = (content_id, result) => {
  Contents.destroy({
    where: {
      id: content_id
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
  getAllContent,
  getAllActiveContent,
  getOneContent,
  getFilterTypeContent,
  getFilterCategoryContent,
  getFilterSpecialContent,
  createContent,
  updateContent,
  deactivateContent,
  deleteContent
}
