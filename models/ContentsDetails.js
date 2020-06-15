const db = require('../helpers/db');

let ContentsDetails = function(content_id, series_id, url, time, intro_start_time = null, intro_finish_time = null){
    this.content_id = content_id;
    this.series_id = series_id;
    this.url = url;
    this.time = time;
    this.intro_start_time = intro_start_time;
    this.intro_finish_time = intro_finish_time;
};

ContentsDetails.getAll = result => {
    let query = `SELECT * FROM contents_details`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

ContentsDetails.getOne = (content_detail_id, result) => {
    let query = `SELECT * FROM contents_details WHERE id = ${content_detail_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
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
