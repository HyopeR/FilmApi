const db = require('./db');
const bcrypt = require('bcryptjs');

let Authentication = function(){};

Authentication.login = (username, password, result) => {
    let query = `SELECT * FROM users WHERE users.username = '${username}'`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if (res.rowCount > 0) {

            console.log(res.rows[0].password)

            bcrypt.compare(password, res.rows[0].password)
                .then((verification) => {
                    if(!verification)
                        result(null, { status: false, notification: 'Password incorrect.' });
                    else
                        result(null, { status: true });
                });

        }else
            result(null, { status: false, notification: 'Not found user.' });
    });
};

module.exports= Authentication;
