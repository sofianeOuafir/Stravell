const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  // if(req.get('host') === 'stravell.herokuapp.com' || req.protocol === 'http'){
  //   res.redirect(301, 'https://stravell.com' + req.path)
  //   return;
  // }
  
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is up at: ' + port);
});
