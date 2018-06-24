"use strict";

const express = require('express');
const router = express.Router();

/* 路由 */
router.get('/', function(req, res, next) {
  res.render('android');
});


module.exports = router;