const db = require('../helpers/db');

let Series = function(content_id, series_season, tr_episode_name, eng_episode_name, episode_number){
    this.content_id = content_id;
    this.series_season = series_season;
    this.tr_episode_name = tr_episode_name;
    this.eng_episode_name = eng_episode_name;
    this.episode_number = episode_number;
};

Series.getAll = result => {
    let query = `SELECT * FROM series`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Series.getOne = (series_id, result) => {
    let query = `SELECT * FROM series WHERE id = ${series_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Series.getContentAllSeason = (content_id, result) => {

    let query = `SELECT series_season, content_id,
        array_agg( json_build_object(
                  'episode_number', episode_number,
                  'tr_episode_name', tr_episode_name,
                  'eng_episode_name', eng_episode_name
        )) as episodes
    FROM series 
    WHERE content_id = ${content_id}
    GROUP BY series_season, content_id`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Series.getContentOneSeason = (content_id, series_season, result) => {
    let query = `SELECT * FROM series WHERE content_id = ${content_id} AND series_season = ${series_season}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Series.create = (newEpisode, result) => {

    let query = `INSERT INTO 
    series (content_id, series_season, tr_episode_name, eng_episode_name, episode_number) 
    VALUES( $1, $2, $3, $4, $5 ) RETURNING *`;
    const { content_id, series_season, tr_episode_name, eng_episode_name, episode_number } = newEpisode;

    db.query(query, [content_id, series_season, tr_episode_name, eng_episode_name, episode_number], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

Series.update = (series_id, newEpisode, result) => {
    let query = `UPDATE series 
    SET content_id = $1, 
        series_season = $2, 
        tr_episode_name = $3, 
        eng_episode_name = $4, 
        episode_number = $5
    WHERE id = ${series_id} RETURNING *`;

    const { content_id, series_season, tr_episode_name, eng_episode_name, episode_number } = newEpisode;

    db.query(query, [content_id, series_season, tr_episode_name, eng_episode_name, episode_number], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

Series.delete = (series_id, result) => {
    let query = `DELETE FROM series WHERE id = ${series_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deletion failed.' });
    });
};

module.exports= Series;
