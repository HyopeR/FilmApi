const db = require('../helpers/db');

let ContentsDetails = function(content_id, series_id = null, url, time, intro_start_time = null, intro_finish_time = null){
    this.content_id = content_id;
    this.series_id = series_id;
    this.url = url;
    this.time = time;
    this.intro_start_time = intro_start_time;
    this.intro_finish_time = intro_finish_time;
};

ContentsDetails.getAll = result => {
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
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

ContentsDetails.getOne = (content_detail_id, result) => {
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
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

ContentsDetails.getOneContents = (content_id, result) => {
    let query = `SELECT series_season, contents_details.content_id, contents.tr_name, contents.eng_name,
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
        )) as episodes
        
        FROM contents_details
        LEFT JOIN (SELECT * FROM series ORDER BY series_season, episode_number) as puppet_series
        ON contents_details.series_id = puppet_series.id
        LEFT JOIN contents
        ON contents_details.content_id = contents.id
        
        WHERE contents_details.content_id = ${content_id}
        GROUP BY puppet_series.series_season, contents_details.content_id, contents.tr_name, contents.eng_name`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

ContentsDetails.create = (newContentDetail, result) => {

    let query = `INSERT INTO contents_details (content_id, series_id, url, time, intro_start_time, intro_finish_time) 
    VALUES( $1, $2, $3, $4, $5, $6 ) RETURNING *`;

    const { content_id, series_id, url, time, intro_start_time, intro_finish_time } = newContentDetail;

    db.query(query, [content_id, series_id, url, time, intro_start_time, intro_finish_time], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

ContentsDetails.update = (content_detail_id, newContentDetail, result) => {
    let query = `UPDATE contents_details 
    SET content_id = $1, 
        series_id = $2, 
        url = $3, 
        time = $4, 
        intro_start_time = $5, 
        intro_finish_time = $6
    WHERE id = ${content_detail_id} RETURNING *`;

    const { content_id, series_id, url, time, intro_start_time, intro_finish_time } = newContentDetail;

    db.query(query, [content_id, series_id, url, time, intro_start_time, intro_finish_time], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

ContentsDetails.delete = (content_detail_id, result) => {
    let query = `DELETE FROM contents_details WHERE id = ${content_detail_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deletion failed.' });
    });
};

module.exports= ContentsDetails;
