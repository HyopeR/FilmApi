const db = require('../helpers/db');

let Rooms = function(name, active = true){
    this.name = name;
    this.active = active;
};

Rooms.getAll = result => {
    let query = `SELECT * FROM rooms`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Rooms.getOne = (room_id, result) => {
    let query = `SELECT * FROM rooms WHERE id = ${room_id}`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Rooms.create = (newRoom, result) => {

    let query = `INSERT INTO rooms (name, active) 
    VALUES( $1, $2 ) RETURNING *`;

    const { name, active } = newRoom;

    db.query(query, [name, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

Rooms.update = (room_id, newRoom, result) => {
    let query = `UPDATE rooms 
    SET name = $1,
        active = $2
    WHERE id = ${room_id} RETURNING *`;

    const { name, active } = newRoom;

    db.query(query, [name, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

Rooms.deactivate = (room_id, result) => {
    let query = `UPDATE rooms 
    SET active = false
    WHERE id = ${room_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deactivated failed.' });
    });
};

module.exports= Rooms;


