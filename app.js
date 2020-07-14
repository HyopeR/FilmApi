const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//Extras
const dotenv = require('dotenv');
dotenv.config();

const indexRouter = require('./routes/index');
const authenticationRouter = require('./routes/authentication');

const categoriesRouter = require('./routes/categories');

const contentsCategoriesRouter = require('./routes/contentsCategories');
const contentsTypesRouter = require('./routes/contentsTypes');
const contentsDetailsRouter = require('./routes/contentsDetails');
const contentsRouter = require('./routes/contents');
const seriesRouter = require('./routes/series');

const usersListsRouter = require('./routes/usersLists');
const usersRoomsRouter = require('./routes/usersRooms');
const usersScoresRouter = require('./routes/usersScores');
const usersCommentsRouter = require('./routes/usersComments');
const usersActivitiesRouter = require('./routes/usersActivities');
const usersRouter = require('./routes/users');

const roomsActivitiesRouter = require('./routes/roomsActivities');
const roomsRouter = require('./routes/rooms');

const friendsRouter = require('./routes/friends');
const activitiesRouter = require('./routes/activities');

const servicesRouter = require('./routes/services');

const app = express();

//DB
const db = require('./helpers/db');
db.connect();

// Config
const config = require('./config');
app.set('api_secret_key', config.api_secret_key); //Global kullanıma izin verme.

// Middleware
const verifyToken = require('./middleware/verify-token');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', verifyToken);

app.use('/authentication', authenticationRouter);
app.use('/api/categories', categoriesRouter);

app.use('/api/contents/categories', contentsCategoriesRouter);
app.use('/api/contents/types', contentsTypesRouter);
app.use('/api/contents/details', contentsDetailsRouter);
app.use('/api/contents', contentsRouter);
app.use('/api/series', seriesRouter);

app.use('/api/users/lists', usersListsRouter);
app.use('/api/users/rooms', usersRoomsRouter);
app.use('/api/users/scores', usersScoresRouter);
app.use('/api/users/comments', usersCommentsRouter);
app.use('/api/users/activities', usersActivitiesRouter);
app.use('/api/users', usersRouter);

app.use('/api/rooms/activities', roomsActivitiesRouter);
app.use('/api/rooms', roomsRouter);

app.use('/api/friends', friendsRouter);
app.use('/api/activities', activitiesRouter);

app.use('/api/services', servicesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
