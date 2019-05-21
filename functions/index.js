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
  const mail = request.query.mail;
  const oneTimeLogin = request.query['one-time-login'];

  if (md5(`${mail}+zout-en-spekjes`) === oneTimeLogin) {
    let subscriberHash = md5(mail.toLowerCase());
    mailchimp.get(`/lists/d07c3eb514/members/${subscriberHash}`)
    .then(function (results) {
      response.json(results);
    })
    .catch(function (error) {
      response.json({
        message: 'Something went wrong',
        stack: error
      });
    });
  }
});

exports.updateProfile = functions.https.onRequest((request, response) => {
  const mail = request.query.mail;
  const oneTimeLogin = request.query['one-time-login'];

  if (md5(`${mail}+zout-en-spekjes`) === oneTimeLogin) {
    let subscriberHash = md5(mail.toLowerCase());
    mailchimp.patch(`/lists/d07c3eb514/members/${subscriberHash}`, {
      merge_fields: request.body.merge_fields
    })
    .then(function (results) {
      response.json(results);
    })
    .catch(function (error) {
      response.json({
        error: error
      });
    });
  }
});


