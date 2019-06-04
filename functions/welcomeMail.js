import md5 from 'md5';
import {mailTemplate} from './mailTemplate.js';
import {Response, getMailchimpProfileByMail} from "./helpers";
import AWS from 'aws-sdk';
AWS.config.update({region: 'eu-west-1'});

export async function welcomeMail (event) {
  if (!'mail' in event.queryStringParameters) {
    return Response(400, 'Please provide the query argument mail');
  }

  const mail = event.queryStringParameters.mail;

  let profile = await getMailchimpProfileByMail(mail);

  if (!profile) {
    return new Response(403, 'Helaas, je bent (nog) geen gast');
  }

  let mailTemplateParams = {
    title: 'Daniel & Wilma gaan trouwen!',
    domain: 'https://daniel-wilma.nl/',
    body: `Dat willen we graag vieren met jou en andere mensen die je misschien kent of nog kunt leren kennen. Kom je ook?`,
    link: `https://daniel-wilma.nl/?mail=${mail}&one-time-login=${md5(mail + '+zout-en-spekjes')}`
  };

  let renderedMail = mailTemplate(mailTemplateParams);

  const params = {
    Destination: { ToAddresses: [ mail ] },
    Message: {
      Body: {
        Html: { Charset: "UTF-8", Data: renderedMail },
        Text: { Charset: "UTF-8", Data: mailTemplateParams.title + ' ' + mailTemplateParams.body + ' ' + mailTemplateParams.link }
      },
      Subject: { Charset: 'UTF-8', Data: mailTemplateParams.title }
    },
    Source: 'website@daniel-wilma.nl'
  };

  return new AWS.SES().sendEmail(params).promise().then(
    function(data) {
      return new Response(200, 'Gelukt!');
    }).catch(
    function(error) {
      return new Response(400, error)
    });

};