var app = require('../app').app;
var upload = require('../app').upload;
var serverPath = require('../app').serverPath;
var db = require('../ext/db');
var fs = require('fs');
var crypto = require('crypto');
var mkdirp = require('mkdirp');

// read
app.get('/dataset', function(req, res){
    db.all("SELECT id, name FROM datas", function(err, rows){
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
        var stmt = db.prepare("INSERT INTO datas (name, path) VALUES (?, ?)");
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
        var stmt = db.prepare("SELECT * FROM datas WHERE id=?");
        stmt.get(id, function(err, row){
            stmt.finalize()
            var path = row['path'];

            fs.readFile(req.file.path, function (err, data) {
                var newPath = serverPath + "/data/" + path + '/' + req.body.path
                var newFullPath = newPath + '/' + req.file.originalname;
                if (!fs.existsSync(newPath)){
                    mkdirp.sync(newPath);
                }

                fs.writeFile(newFullPath, data, function (err) {
                    fs.unlink(req.file.path);
                    res.status(200).json({"status": "done"});
                });
            });
        });
    }
});
