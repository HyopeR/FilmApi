const db = require('../helpers/db');

let Contents = function(type_id, tr_name, eng_name, imdb_score, poster_url, active = true){
    this.type_id = type_id;
    this.tr_name = tr_name;
    this.eng_name = eng_name;
    this.imdb_score = imdb_score;
    this.poster_url = poster_url;
    this.active = active;
};

const getQueryRoofDynamic = (parameterString) => {
    let createdQuery = `SELECT 
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
    `
;

    return createdQuery;
};

Contents.getAll = result => {
    let query = getQueryRoofDynamic(``);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Contents.getAllActive = result => {
    let query = getQueryRoofDynamic(
        `WHERE contents.active = true`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Contents.getOne = (content_id, result) => {
    let query = getQueryRoofDynamic(
        `WHERE contents.id = ${content_id}`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Contents.getFilterType = (content_type_id, result) => {

    let query = getQueryRoofDynamic(
        `WHERE contents.active = true AND contents.type_id = ${content_type_id}`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Contents.getFilterCategory = (category_id, result) => {
    let query = getQueryRoofDynamic(
        `WHERE contents.active = true
        AND contents.id IN (SELECT content_id FROM contents_categories WHERE category_id = ${category_id})`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Contents.getFilterSpecial = (content_type_id, category_id, result) => {

    let query = getQueryRoofDynamic(
        `WHERE contents.active = true 
        AND contents.type_id = ${content_type_id}
        AND contents.id IN (SELECT content_id FROM contents_categories WHERE category_id = ${category_id})`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Contents.create = (newContent, result) => {

    let query = `INSERT INTO 
    contents (type_id, tr_name, eng_name, imdb_score, poster_url, active) 
    VALUES( $1, $2, $3, $4, $5, $6 ) RETURNING *`;
    const { type_id, tr_name, eng_name, imdb_score, poster_url, active } = newContent;

    db.query(query, [type_id, tr_name, eng_name, imdb_score, poster_url, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

Contents.update = (content_id, newContent, result) => {
    let query = `UPDATE contents 
    SET type_id = $1, 
        tr_name = $2, 
        eng_name = $3, 
        imdb_score = $4, 
        poster_url = $5,
        active = $6
    WHERE id = ${content_id} RETURNING *`;

    const { type_id, tr_name, eng_name, imdb_score, poster_url, active } = newContent;

    db.query(query, [type_id, tr_name, eng_name, imdb_score, poster_url, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

Contents.deactivate = (content_id, result) => {
    let query = `UPDATE contents 
    SET active = false
    WHERE id = ${content_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deactivated failed.' });
    });
};

module.exports= Contents;
