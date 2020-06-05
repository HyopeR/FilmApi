const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const seriesSchema = new Schema({
    seriesName: {
        type: Schema.Types.String,
        required: true
    },
    imdbScore: {
        type: Schema.Types.Number,
        required: true
    },
    episodes: [
        // {
        //     season: [{
        //         episodeName: {
        //             type: Schema.Types.String,
        //             required: true
        //         },
        //         time: {
        //             type: Schema.Types.String,
        //             required: true
        //         },
        //         introStartTime: Schema.Types.Number,
        //         introFinishTime: Schema.Types.Number,
        //         comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        //     }]
        // }
    ],

    category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    score: {type: Schema.Types.ObjectId, ref: 'Score'}
});

module.exports = mongoose.model('Series', seriesSchema);
