const db = require('../helpers/db');

let Contents = function(type_id, tr_name, eng_name, imdb_score, active = true){
    this.type_id = type_id;
    this.tr_name = tr_name;
    this.eng_name = eng_name;
    this.imdb_score = imdb_score;
    this.active = active;
};

