const db = require('../helpers/db');

let UsersRooms = function(user_id, room_id, authority = 0){
    this.user_id = user_id;
    this.room_id = room_id;
    this.authority = authority;
};

UsersRooms.getAll = result => {
    let query = `SELECT * FROM users_rooms`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

UsersRooms.getOne = (user_id, room_id, result) => {
    let query = `SELECT * FROM users_rooms WHERE user_id = ${user_id} AND room_id = ${room_id}`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

UsersRooms.create = (newUserRoom, result) => {

    let query = `INSERT INTO users_rooms (user_id, room_id, authority) 
    VALUES( $1, $2, $3 ) RETURNING *`;

    const { user_id, room_id, authority } = newUserRoom;

    db.query(query, [user_id, room_id, authority], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

UsersRooms.update = (user_id, room_id, updateUserRoom, result) => {
    let query = `UPDATE users_rooms 
    SET authority = $1
    WHERE user_id = ${user_id} AND room_id = ${room_id} RETURNING *`;

    // updateUserRoom = { authority }
    const { authority } = updateUserRoom;

    db.query(query, [authority], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

UsersRooms.delete = (user_id, room_id, result) => {
    let query = `DELETE FROM users_rooms WHERE user_id = ${user_id} AND room_id = ${room_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deleted failed.' });
    });
};

module.exports= UsersRooms;


