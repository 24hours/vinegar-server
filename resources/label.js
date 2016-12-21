var app = require('../app').app;
var upload = require('../app').upload;
var serverPath = require('../app').serverPath;
var db = require('../ext/db');
var fs = require('fs');
var crypto = require('crypto');
var mkdirp = require('mkdirp');

// read
app.get('/label/:id', function(req, res){

    var stmt = db.prepare('SELECT * from label where dataset_id=?')
    stmt.all([req.params.id], function(err, rows){
        stmt.finalize();
        if(!err){
            res.status(200).json({'data': rows})
        } else {
            res.status(500).json({'error': err})
        }
    });
});

// create
app.post('/label', function(req, res){
    var path = crypto.randomBytes(20).toString('hex');
    var name = req.body['name'] || undefined;
    var dataset_id = req.body['dataset'] || undefined;

    if(name == undefined || dataset_id == undefined){
        res.status(500).json({"error": "name/dataset must be defined"});
    } else {
        var stmt = db.prepare("INSERT INTO label (dataset_id, name) VALUES (?, ?)");
        stmt.run([dataset_id, name], function(err){
            if(err){
                res.status(500).json({"error": err});
            } else {
                res.json({"data": {"id": this.lastID}});
            }
        });
    }
});
