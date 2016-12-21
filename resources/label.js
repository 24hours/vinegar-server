var app = require('../app').app;
var upload = require('../app').upload;
var serverPath = require('../app').serverPath;
var db = require('../ext/db');
var fs = require('fs');
var crypto = require('crypto');
var mkdirp = require('mkdirp');

// read
app.get('/label', function(req, res){
    db.all("SELECT id, name FROM dataset", function(err, rows){
        res.status(200).json({'data': rows})
    });
});

// create
app.post('/dataset', function(req, res){
    var path = crypto.randomBytes(20).toString('hex');
    var name = req.body['name'] || undefined;
    if(name == undefined){
        res.status(500).json({"error": "name must be defined"});
    } else {
        var stmt = db.prepare("INSERT INTO dataset (name, path) VALUES (?, ?)");
        stmt.run(name, path, function(err){
            if(err){
                res.status(500).json({"error": err});
            } else {
                res.json({"data": {"id": this.lastID}});
            }
        });
    }
});

app.post('/dataset/upload', upload.single('file'), function (req, res) {
    var id = req.body['id'];
    if(!id){
        res.status(500).json({"error": "id must be defined"});
    } else {
        var stmt = db.prepare("SELECT * FROM dataset WHERE id=?");
        stmt.get(id, function(err, row){
            stmt.finalize()
            var path = row['path'];

            fs.readFile(req.file.path, function (err, data) {
                var newPath = serverPath + "/data/" + path + '/' + req.body.path;
                var newFullPath = newPath + '/' + req.file.originalname;
                var filePath = "data/" + path + '/' + req.body.path + '/' + req.file.originalname;

                var mime = req.file.mimetype.split('/')[0];
                if(mime == 'image'){
                    if (!fs.existsSync(newPath)){
                        mkdirp.sync(newPath);
                    }

                    fs.writeFile(newFullPath, data, function (err) {
                        var stmt = db.prepare("INSERT into DATA (dataset_id, name, path) VALUES (?, ?, ?)");
                        stmt.run([id, req.file.originalname, filePath])
                        fs.unlink(req.file.path);
                        res.status(200).json({"status": "done"});
                    });
                } else {
                    fs.unlink(req.file.path);
                    res.status(500).json({"error": "target is not image"});
                }
            });
        });
    }
});

app.get('/dataset/:id', function (req, res) {
    var stmt = db.prepare("SELECT name, path FROM data WHERE dataset_id=?");
    stmt.all(req.params.id, function(err, row){
        if(!err){
            res.status(200).json({"data": row})
        } else {
            res.status(500).json({"error": err})
        }
    });
});
