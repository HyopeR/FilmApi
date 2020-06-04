const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filmSchema = new Schema({
    filmName: {
        type: Schema.Types.String,
        required: true
    },
    imdbScore: {
        type: Schema.Types.Number,
        required: true
    },
    time: {
        type: Schema.Types.String,
        required: true
    },
    introStartTime: Schema.Types.Number,
    introFinishTime: Schema.Types.Number,
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    score: {type: Schema.Types.ObjectId, ref: 'Score'}
});

module.exports = mongoose.model('Film', filmSchema);
