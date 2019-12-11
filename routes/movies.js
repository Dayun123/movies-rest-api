const express = require('express');
const db = require('../src/db/db');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json([{
    msg: "Success",
  }]);
});

module.exports = router;
