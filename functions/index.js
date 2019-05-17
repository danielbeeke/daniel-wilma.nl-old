const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Mailchimp = require('mailchimp-api-v3');
const md5 = require('md5');

const mailchimp = new Mailchimp(functions.config().mailchimp.key);

const serviceAccount = require('./../serviceAccountKey.json');

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 databaseURL: "https://trouwen-d591e.firebaseio.com"
});

exports.getProfile = functions.https.onRequest((request, response) => {
 const uid = request.query.uid;
 admin.auth().getUser(uid).then(user => {

  if (user && user.email) {
   let subscriberHash = md5(user.email.toLowerCase());
   mailchimp.get(`/lists/d07c3eb514/members/${subscriberHash}`)
     .then(function(results) {
      response.json(results);
     })
     .catch(function (err) {
      response.json({
       error: err
      });
     });
  }
 })
 .catch(error => {
  console.log(error)
  response.json({
   error: 'User not found'
  });
 });
});

exports.updateProfile = functions.https.onRequest((request, response) => {
 const uid = request.query.uid;
 admin.auth().getUser(uid).then(user => {

  if (user && user.email) {
   let subscriberHash = md5(user.email.toLowerCase());
   mailchimp.get(`/lists/d07c3eb514/members/${subscriberHash}`)
     .then(function(results) {
      response.json(results);
     })
     .catch(function (err) {
      response.json({
       error: err
      });
     });
  }
 })
   .catch(error => {
    console.log(error)
    response.json({
     error: 'User not found'
    });
   });
});


