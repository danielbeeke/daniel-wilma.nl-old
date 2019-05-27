const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.use(bodyParser());

const getProfile = require('./node/getProfile');
const updateProfile = require('./node/updateProfile');
const welcomeMail = require('./node/welcomeMail');
const mailTemplate = require('./node/mailTemplate');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = 3005;

app.get('/api/getProfile', getProfile);
app.post('/api/updateProfile', updateProfile);
app.get('/api/welcomeMail', welcomeMail);
app.get('/api/mail', mailTemplate);

console.log(`Server is listening on http://localhost:${port}`);
app.listen(port);