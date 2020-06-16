const db = require('../helpers/db');

let Contents = function(type_id, tr_name, eng_name, imdb_score, active = true){
    this.type_id = type_id;
    this.tr_name = tr_name;
    this.eng_name = eng_name;
    this.imdb_score = imdb_score;
    this.active = active;
};

const getQueryRoofDynamic = (parameterString) => {
    let createdQuery = `SELECT
    contents.id,
    contents.tr_name,
    contents.eng_name,
    contents.imdb_score,
    contents.active,
    contents.created_at,
    contents.type_id,
    contents_types.type_name,
    array_agg( json_build_object ( 
            'category_id', categories.id,
            'category_name', categories.name 
    )) as categories

    FROM contents
        LEFT JOIN contents_types
        ON contents.type_id = contents_types.id
        LEFT JOIN  (SELECT *
        FROM contents_categories
        ORDER BY category_id) AS puppet_contents_category
        ON contents.id = puppet_contents_category.content_id
        LEFT JOIN categories
        ON puppet_contents_category.category_id = categories.id
    `
    +
        parameterString
    +
    `
    GROUP BY
        contents.id,
        contents.type_id,
        contents.tr_name,
        contents.eng_name,
        contents.imdb_score,
        contents.active,
        contents.created_at,
        contents_types.type_name
    `;

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
    let query = getQueryRoofDynamic(`WHERE contents.active = true`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Contents.getOne = (content_id, result) => {
    let query = getQueryRoofDynamic(`WHERE contents.id = ${content_id}`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Contents.getFilterType = (content_type_id, result) => {

    let query = getQueryRoofDynamic(`WHERE contents.active = true AND contents.type_id = ${content_type_id}`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Contents.getFilterCategory = (category_id, result) => {

    let query = getQueryRoofDynamic(`WHERE contents.active = true AND puppet_contents_category.category_id = ${category_id}`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Contents.getFilterSpecial = (content_type_id, category_id, result) => {

    let query = getQueryRoofDynamic(`WHERE contents.active = true AND contents.type_id = ${content_type_id}
    AND puppet_contents_category.category_id = ${category_id}`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Contents.create = (newContent, result) => {

    let query = `INSERT INTO 
    contents (type_id, tr_name, eng_name, imdb_score, active) 
    VALUES( $1, $2, $3, $4, $5 ) RETURNING *`;
    const { type_id, tr_name, eng_name, imdb_score, active } = newContent;

    db.query(query, [type_id, tr_name, eng_name, imdb_score, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
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
        active = $5
    WHERE id = ${content_id} RETURNING *`;

    const { type_id, tr_name, eng_name, imdb_score, active } = newContent;

    db.query(query, [type_id, tr_name, eng_name, imdb_score, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

Contents.inActive = (content_id, result) => {
    let query = `UPDATE contents 
    SET active = false
    WHERE id = ${content_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deletion failed.' });
    });
};

module.exports= Contents;
