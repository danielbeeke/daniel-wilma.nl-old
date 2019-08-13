import {Response} from './helpers.js';
import {checkHash, getMailchimpProfileByMail} from "./helpers";
import AWS from 'aws-sdk';
AWS.config.update({region: 'eu-west-1'});

export async function uploadPhoto (event) {

  let body = JSON.parse(event.body);

  if (!body['photo']) {
    return Response(400, 'Please provide a POST photo');
  }

  if (!body['message']) {
    return Response(400, 'Please provide a POST message');
  }

  if (!event.queryStringParameters['one-time-login']) {
    return Response(400, 'Please provide the query argument one-time-login');
  }

  if (!event.queryStringParameters['mail']) {
    return Response(400, 'Please provide the query argument mail');
  }

  const mail = event.queryStringParameters.mail;
  const oneTimeLogin = event.queryStringParameters['one-time-login'];

  let result = false;

  if (checkHash(mail, oneTimeLogin)) {
    let profile = await getMailchimpProfileByMail(mail);

    if (profile) {
      let s3 = new AWS.S3();

      try {
        let buffer = new Buffer(body.photo.replace(/^data:image\/\w+;base64,/, ''),'base64');

        result = await s3.putObject({
          Bucket: 'trouwen',
          Key: mail + '-' + Date.now() + '.png',
          Body: buffer,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg',
          ACL: 'public-read',
          Metadata: {
            message: body.message
          }
        }).promise();
      }
      catch (exception) {
        return new Response(400, exception);
      }
    }
  }

  if (result) {
    console.log(result)
    return new Response(200, result);
  }
  else {
    return new Response(400, 'Something went wrong');
  }
};