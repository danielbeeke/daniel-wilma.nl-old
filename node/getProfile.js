const settings = require('./../settings');
const md5 = require('md5');
const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp(settings.mailchimp);

module.exports = (request, response) => {
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
          error: 'Something went wrong',
          stack: error
        });
      });
  }
  else {
    response.json({
      error: 'Something went wrong',
    });
  }
};