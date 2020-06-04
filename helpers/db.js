const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.DB_STRING,
        {
            //useMongoClient: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected.');
    });

    mongoose.connection.on('error', (error) => {
        console.log('MongoDB: Error', error);
    });

    //Mongoose Promise ayarlama.
    mongoose.Promise = global.Promise;
};
