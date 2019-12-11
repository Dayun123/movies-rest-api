const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/users', usersRouter);

app.use((err, req, res, next) => {
  res.status(500).json({
    statusCode: 500,
    statusMessage: err.message,
  });
});

module.exports = app;
