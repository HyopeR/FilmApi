const db = require('../helpers/db');

let Series = function(content_id, series_season, tr_episode_name, eng_episode_name, episode_number){
    this.content_id = content_id;
    this.series_season = series_season;
    this.tr_episode_name = tr_episode_name;
    this.eng_episode_name = eng_episode_name;
    this.episode_number = episode_number;
};
