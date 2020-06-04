const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    catName: {
        type: Schema.Types.String
    }
});

module.exports = mongoose.model('Category', categorySchema);
