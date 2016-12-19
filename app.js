var express = require('express');
var multer  = require('multer');
var cors = require('cors');
var app = express();
var upload = multer({ dest: 'uploads/' });
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());

module.exports = {
        app: app,
        upload: upload,
        serverPath: __dirname
    };
