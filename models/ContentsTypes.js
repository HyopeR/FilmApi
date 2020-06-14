const db = require('../helpers/db');

let ContentsTypes = function(type_name){
    this.type_name = type_name;
};

ContentsTypes.getAll = result => {
    let query = `SELECT * FROM contents_types`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

ContentsTypes.getOne = (content_type_id, result) => {
    let query = `SELECT * FROM contents_types WHERE id = ${content_type_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

ContentsTypes.create = (newContentType, result) => {

    let query = `INSERT INTO contents_types (type_name) VALUES( $1 ) RETURNING *`;
    db.query(query, [newContentType.type_name], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

ContentsTypes.update = (content_type_id, newContentType, result) => {
    let query = `UPDATE contents_types SET type_name = $1 WHERE id = ${content_type_id} RETURNING *`;
    db.query(query, [newContentType.type_name], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

ContentsTypes.delete = (content_type_id, result) => {
    let query = `DELETE FROM contents_types WHERE id = ${content_type_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deletion failed.' });
    });
};

module.exports= ContentsTypes;
