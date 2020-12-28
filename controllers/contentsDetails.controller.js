const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const ContentsDetails = require('../models/ContentsDetails');
const db = require('../helpers/db');

const getAllContentDetail = result => {
  let query = `SELECT contents_details.id,
    contents_details.content_id,
    contents_details.series_id,
    contents_details.url,
    contents_details.time,
    contents_details.intro_start_time,
    contents_details.intro_finish_time,
    contents_details.created_at,
    series.series_season,
    series.tr_episode_name,
    series.eng_episode_name,
    series.episode_number
    FROM contents_details
    LEFT JOIN series ON contents_details.series_id = series.id
    `;

  db.query(query, { type: QueryTypes.SELECT })
    .then(contentsDetails => result(null, contentsDetails))
    .catch(err => result(err));
};

const getOneContentDetail = (content_detail_id, result) => {
  let query = `SELECT contents_details.id,
    contents_details.content_id,
    contents_details.series_id,
    contents_details.url,
    contents_details.time,
    contents_details.intro_start_time,
    contents_details.intro_finish_time,
    contents_details.created_at,
    series.series_season,
    series.tr_episode_name,
    series.eng_episode_name,
    series.episode_number
    FROM contents_details
    LEFT JOIN series ON contents_details.series_id = series.id
    WHERE contents_details.id = ${content_detail_id}`;

  db.query(query, { type: QueryTypes.SELECT })
    .then(contentDetail => {
      if(lodash.isEmpty(contentDetail))
        result({notification: 'Not available ID.'});
      else
        result(null, lodash.head(contentDetail));
    })
    .catch(err => result(err));
};

const getOneContentsAllDetails = (content_id, result) => {
  let query = `
    SELECT 
        contents.id,
        contents.tr_name,
        contents.eng_name,
        json_object_agg ( 
            COALESCE( puppet_contents_details.series_season, 0), 
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
        LEFT JOIN 
        (
            SELECT * 
            FROM series 
            ORDER BY content_id, series_season, episode_number ASC
        ) as puppet_series

        ON contents_details.series_id = puppet_series.id
        GROUP BY 
            contents_details.content_id,
            puppet_series.series_season

        ORDER BY
            puppet_series.series_season ASC
            
    ) AS puppet_contents_details
    ON contents.id = puppet_contents_details.content_id

    WHERE contents.id = ${content_id}
    GROUP BY
        contents.id,
        contents.tr_name,
        contents.eng_name
    `;

  db.query(query, { type: QueryTypes.SELECT })
    .then(contentDetail => {
      if(lodash.isEmpty(contentDetail))
        result({notification: 'Not available ID.'});
      else
        result(null, lodash.head(contentDetail));
    })
    .catch(err => result(err));
};

const createContentDetail = (newContentDetail, result) => {

  ContentsDetails.create(newContentDetail, {
    returning: true
  })
    .then(contentDetail => {
      if (lodash.isEmpty(contentDetail))
        result({notification: 'Adding failed.'});
      else
        result(null, contentDetail)
    })
    .catch(err => result(err));
};

const updateContentDetail = (content_detail_id, updateValues, result) => {

  ContentsDetails.update(updateValues, {
    where: {
      id: content_detail_id
    },
    returning: true,
  }).then(([status, [updatedContentDetail]]) => {
    if (status === 1)
      result(null, updatedContentDetail)
    else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))
};

const deleteContentDetail = (content_detail_id, result) => {

  ContentsDetails.destroy({
    where: {
      id: content_detail_id
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
  getAllContentDetail,
  getOneContentDetail,
  getOneContentsAllDetails,
  createContentDetail,
  updateContentDetail,
  deleteContentDetail
}
