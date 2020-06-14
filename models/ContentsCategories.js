const db = require('../helpers/db');

let ContentsCategories = function(content_id, category_id){
    this.content_id = content_id;
    this.category_id = category_id;
};

