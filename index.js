var app = require('./app').app;
require('./resources/dataset');
require('./resources/data');
require('./resources/label');

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
});
