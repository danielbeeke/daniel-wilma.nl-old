const settings = require('./../settings');
const nodeMailer = require('nodemailer');
const md5 = require('md5');
const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp(settings.mailchimp);
const ejs = require('ejs');

module.exports = (request, response) => {
  const mail = request.query.mail;

  if (mail) {
    let subscriberHash = md5(mail.toLowerCase());
    mailchimp.get(`/lists/d07c3eb514/members/${subscriberHash}`)
    .then(function (results) {
      let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'daniel.beeke@gmail.com',
          pass: settings.gmail
        }
      });

      ejs.renderFile('views/mail.ejs', {
        title: 'Daniel & Wilma gaan trouwen!',
        domain: 'http://localhost:3000/',
        body: `Dat willen we graag vieren met jou en andere mensen die je misschien kent of nog kunt leren kennen. Kom je ook?`,
        link: `http://localhost:3000/?mail=${mail}&one-time-login=${md5(mail + '+zout-en-spekjes')}`
      }, {}, function(error, output){
        if (error) {
          response.json({
            message: 'Mail kon niet gerenderd worden',
          });
        }
        else {
          let mailOptions = {
            from: '"Daniel en Wilma" <daniel.beeke@gmail.com>',
            to: mail,
            replyTo: 'website@daniel-wilma.nl',
            subject: 'Daniel en Wilma gaan trouwen!',
            text: 'Daniel en Wilma gaan trouwen!',
            html: output
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              response.json({
                message: 'Mail kon niet verstuurd worden',
              });
            }
            else {
              response.json({
                message: 'Verstuurd!',
              });
            }
          });
        }
      });
    })
    .catch(function (error) {
      response.json({
        message: 'Je bent (nog) geen gast.'
      });
    });
  }
  else {
    response.json({
      message: 'Een technische fout :(',
    });
  }
};