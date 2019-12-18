const express = require('express');
const logger = require('morgan');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

module.exports = app;
