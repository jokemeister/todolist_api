const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes')

// middlewares
function logRequest({method, url}, res, next) {
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  next();
};
app.use(cors());
app.use(logRequest);
app.use(express.json());
app.use(router);
// /middlewares

module.exports = app;