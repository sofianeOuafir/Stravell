const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
var enforce = require('express-sslify');
var http = require('http');

app.use(enforce.HTTPS());
app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});
