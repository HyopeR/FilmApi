const db = require('../helpers/db');

let Categories = function(name){
    this.name = name;
};

Categories.getAll = result => {
    let query = `SELECT * FROM categories`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Categories.getOne = (category_id, result) => {
    let query = `SELECT * FROM categories WHERE id = ${category_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Categories.create = (newCategory, result) => {

    let query = `INSERT INTO categories (name) VALUES( $1 ) RETURNING *`;
    db.query(query, [newCategory.name], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

Categories.update = (category_id, newCategory, result) => {
    let query = `UPDATE categories SET name = $1 WHERE id = ${category_id} RETURNING *`;
    db.query(query, [newCategory.name], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

Categories.delete = (category_id, result) => {
    let query = `DELETE FROM categories WHERE id = ${category_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deletion failed.' });
    });
};

module.exports= Categories;
