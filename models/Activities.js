const db = require('../helpers/db');

let Activities = function(
    content_detail_id,
    is_one = true,
    activity_start = true,
    activity_finish = false,
    activity_score = false,
    activity_comment  = false,
    activity_passing_time  = '0'){
    this.content_detail_id = content_detail_id;
    this.is_one = is_one;
    this.activity_start = activity_start;
    this.activity_finish = activity_finish;
    this.activity_score = activity_score;
    this.activity_comment = activity_comment;
    this.activity_passing_time = activity_passing_time;
};
