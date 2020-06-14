const db = require('../helpers/db');

let UsersScores = function(user_id, content_id, score){
    this.user_id = user_id;
    this.content_id = content_id;
    this.score = score;
};
