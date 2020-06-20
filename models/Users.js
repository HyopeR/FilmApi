const db = require('../helpers/db');

let Users = function(username, name, surname, email, password, active = true){
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.active = active;
};

Users.getAll = result => {
    let query = `SELECT * FROM users`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Users.getOne = (user_id, result) => {
    let query = `SELECT * FROM users WHERE id = ${user_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Users.create = (newUser, result) => {

    let query = `INSERT INTO users (username, name, surname, email, password, active) 
    VALUES( $1, $2, $3, $4, $5, $6 ) RETURNING *`;

    const { username, name, surname, email, password, active } = newUser;

    db.query(query, [username, name, surname, email, password, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

Users.update = (user_id, newUser, result) => {
    let query = `UPDATE users 
    SET username = $1, 
        name = $2,
        surname = $3,
        email = $4,
        password = $5,
        active = $6
    WHERE id = ${user_id} RETURNING *`;

    const { username, name, surname, email, password, active } = newUser;

    db.query(query, [username, name, surname, email, password, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

Users.deactivate = (user_id, result) => {
    let query = `UPDATE users 
    SET active = false
    WHERE id = ${user_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deactivated failed.' });
    });
};

module.exports= Users;
