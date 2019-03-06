var express = require('express');
var fs = require('fs');
var cors = require('cors');
var fileOpr = module.exports = {
  getJSON() {
    json = fs.readFileSync('UserData.json');
    return JSON.parse(json);
  },

  setJSON(ValueToSave) {
    json = JSON.stringify(ValueToSave);
    fs.writeFileSync('UserData.json', json);
  }
}
app = module.exports = express.createServer();
app.configure(function () {
    app.use(function (req, res, next) {

      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });
  app.use(cors());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/static'));
  app.use(express.static(__dirname + '/../libs'));
});



app.get('/users', function (_, response) {
  response.send(fileOpr.getJSON());
});


app.post('/users', function (request, response) {
  fileOpr.setJSON(request.body);
  response.send({ response: 'Success'});
});

app.listen(process.argv[2] || 8080);

process.on('uncaughtException', function (err) {
  console.log(JSON.stringify(err));
});

console.log('servers up!');
