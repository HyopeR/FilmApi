const db = require('../helpers/db');

let ContentsCategories = function(content_id, category_id){
    this.content_id = content_id;
    this.category_id = category_id;
};

ContentsCategories.getAll = result => {
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

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

ContentsCategories.getOne = (content_id, result) => {
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

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

ContentsCategories.create = (newContentCategory, result) => {

    let query = `INSERT INTO contents_categories (content_id, category_id) 
    VALUES( $1, $2 ) RETURNING *`;

    const { content_id, category_id } = newContentCategory;

    db.query(query, [content_id, category_id], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

ContentsCategories.update = (param_content_id, param_category_id, newContentCategory, result) => {
    let query = `UPDATE contents_categories 
    SET content_id = $1, 
        category_id = $2
    WHERE content_id = ${param_content_id} AND category_id = ${param_category_id} RETURNING *`;

    const { content_id, category_id } = newContentCategory;

    db.query(query, [content_id, category_id], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

ContentsCategories.delete = (param_content_id, param_category_id, result) => {
    let query = `DELETE FROM contents_categories 
    WHERE content_id = ${param_content_id} AND category_id = ${param_category_id} RETURNING *`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deletion failed.' });
    });
};

module.exports= ContentsCategories;


