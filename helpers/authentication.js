const db = require('../helpers/db');

let Authentication = function(){};

Authentication.login = (username, password, result) => {

    let query = `SELECT * FROM users WHERE username = ${username} AND password = ${password}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

module.exports= Authentication;
