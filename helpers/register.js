const db = require('./db');
const bcrypt = require('bcryptjs');

let Register = function(username, name, surname, email, password, active = true){
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.active = active;
};

Register.register = (newUser, result) => {

    let query = `INSERT INTO users (username, name, surname, email, password, active) 
    VALUES( $1, $2, $3, $4, $5, $6 ) RETURNING *`;

    let { username, name, surname, email, password, active } = newUser;
    bcrypt.hash(password, 10).then((hash) => {

        db.query(query, [username, name, surname, email, hash, active], (err, res) => {
            if (err)
                result(null, err);

            if(res.rowCount > 0)
                result(null, res.rows[0]);
            else
                result(null, { notification: 'Adding failed.' });
        });

    });
};

module.exports= Register;
