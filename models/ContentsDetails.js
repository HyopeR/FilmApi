const db = require('../helpers/db');

let ContentsDetails = function(content_id, series_id, url, time, intro_start_time = null, intro_finish_time = null){
    this.content_id = content_id;
    this.series_id = series_id;
    this.url = url;
    this.time = time;
    this.intro_start_time = intro_start_time;
    this.intro_finish_time = intro_finish_time;
};

