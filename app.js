const express = require('express');
const app = express();
const router = require('./routes')

// middlewares
function logRequest({method, url}, res, next) {
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  next();
};

app.use(logRequest);
app.use(express.json());
app.use(router);
// /middlewares

module.exports = app;