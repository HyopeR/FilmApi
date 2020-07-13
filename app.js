const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//Extras
const dotenv = require('dotenv');
dotenv.config();

//DB
const db = require('./helpers/db');
db.connect();

const indexRouter = require('./routes/index');
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/categories', categoriesRouter);

app.use('/contents/categories', contentsCategoriesRouter);
app.use('/contents/types', contentsTypesRouter);
app.use('/contents/details', contentsDetailsRouter);
app.use('/contents', contentsRouter);
app.use('/series', seriesRouter);

app.use('/users/lists', usersListsRouter);
app.use('/users/rooms', usersRoomsRouter);
app.use('/users/scores', usersScoresRouter);
app.use('/users/comments', usersCommentsRouter);
app.use('/users/activities', usersActivitiesRouter);
app.use('/users', usersRouter);

app.use('/rooms/activities', roomsActivitiesRouter);
app.use('/rooms', roomsRouter);

app.use('/friends', friendsRouter);
app.use('/activities', activitiesRouter);

app.use('/services', servicesRouter);

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
