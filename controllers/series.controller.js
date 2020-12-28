const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const bcrypt = require('bcryptjs');

const Series = require('../models/Series');
const db = require('../helpers/db');

const getAllSeries = result => {
  Series.findAll({
    type: QueryTypes.SELECT
  })
    .then(series => result(null, series))
    .catch(err => result(err))
};

const getOneSeries = (series_id, result) => {
  Series.findOne({
    type: QueryTypes.SELECT,
    where: {
      id: series_id
    }
  })
    .then(series => {
      if (lodash.isEmpty(series))
        result({notification: 'Not available ID.'});
      else
        result(null, series);
    })
    .catch(err => result(err))
};

const getContentAllSeason = (content_id, result) => {

  let query = `SELECT series_season, content_id,
        array_agg( json_build_object(
                  'episode_id', id,
                  'episode_number', episode_number,
                  'tr_episode_name', tr_episode_name,
                  'eng_episode_name', eng_episode_name
        )) as episodes
    FROM (SELECT * FROM series ORDER BY series_season, episode_number) as puppet_series 
    WHERE puppet_series.content_id = ${content_id}
    GROUP BY series_season, content_id
    ORDER BY series_season`;

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'Not available ID.'})
      else
        result(null, data)
    })
    .catch(err => result(err));
};

const getContentOneSeason = (content_id, series_season, result) => {
  let query = `SELECT * FROM series 
    WHERE content_id = ${content_id} AND series_season = ${series_season}
    ORDER BY series_season, episode_number
    `;

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'Not available ID.'})
      else
        result(null, data)
    })
    .catch(err => result(err));
};

const createSeries = (newEpisode, result) => {

  Series.create(newEpisode, {
    returning: true
  })
    .then(episode => {
      if (lodash.isEmpty(episode))
        result({notification: 'Adding failed.'});
      else
        result(null, episode)
    })
    .catch(err => result(err));
};

const updateSeries = (series_id, updateValues, result) => {

  Series.update(updateValues, {
    where: {
      id: series_id,
    },
    returning: true,
  }).then(([status, [updatedSeries]]) => {
    if (status === 1)
      result(null, updatedSeries)
    else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))
};

const deleteSeries = (series_id, result) => {

  Series.destroy({
    where: {
      id: series_id
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
  getAllSeries,
  getOneSeries,
  getContentAllSeason,
  getContentOneSeason,
  createSeries,
  updateSeries,
  deleteSeries
}
