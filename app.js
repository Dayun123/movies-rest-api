const express = require('express');
const logger = require('morgan');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use((err, req, res, next) => {
  res.status(500).json({
    statusCode: 500,
    statusMessage: err.message,
  });
});

module.exports = app;
