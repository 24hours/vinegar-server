var app = require('../app').app;
var express = require('express');


app.use('/data', express.static('data'))
