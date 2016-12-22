var app = require('../app').app;
var express = require('express');
var db = require('../ext/db');

app.use('/data', express.static('data'));

app.post('/data_label', function(req, res){
    var label_id = req.body['label_id'] || undefined;
    var data_id = req.body['data_id'] || undefined;
    var data = req.body['data'] || undefined;

    if(!label_id || !data_id || !data){
        res.status(500).json({"error": "insufficient data"});
    } else {
        var stmt = db.prepare("SELECT * FROM data_label WHERE label_id=? AND data_id=?");
        stmt.get([label_id, data_id], function(err, row){
            stmt.finalize();

            if(row){
                stmt = db.prepare("UPDATE data_label SET data=? WHERE label_id=? AND data_id=?")
            } else {
                stmt = db.prepare("INSERT INTO data_label (data, label_id, data_id) VALUES (?,?,?)")
            }

            stmt.run([JSON.stringify(data), label_id, data_id], function(err, row){
                stmt.finalize()
                if(err){
                    res.status(500).json({"error": err});
                } else {
                    res.status(200).json({"status": "done"});
                }
            });
        });

    }
});

app.get('/data_label/:id', function(req, res){
    var id = req.params.id;

    var stmt = db.prepare("SELECT data_label.data_id as id , data_label.data as label FROM data_label JOIN data ON data.id = data_label.data_id WHERE data.dataset_id = ?");
    stmt.all(id, function(err, row){
        stmt.finalize();

        res.status(200).json({"data": row})
    });
});
