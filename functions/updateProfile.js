import {Response, mailchimpListUrl} from './helpers.js';
import {checkHash} from "./helpers";
import fetch from 'node-fetch';
import md5 from 'md5';

export async function updateProfile (event) {
  if (!event.queryStringParameters['one-time-login']) {
    return Response(400, 'Please provide the query argument one-time-login');
  }

  if (!event.queryStringParameters['mail']) {
    return Response(400, 'Please provide the query argument mail');
  }

  if (!event['body']) {
    return Response(400, 'Please do a POST request with data');
  }

  const mail = event.queryStringParameters.mail;
  const oneTimeLogin = event.queryStringParameters['one-time-login'];
  let result = false;

  if (checkHash(mail, oneTimeLogin)) {
    let subscriberHash = md5(mail.toLowerCase());

    try {
      result = await fetch(`${mailchimpListUrl}/members/${subscriberHash}`, {
        headers: {
          'Authorization': 'apikey ' + process.env.mailchimp
        },
        body: JSON.stringify( {merge_fields: JSON.parse(event.body)})
      });
    }
    catch (error) {
      return Response(403, 'Er ging iets mis met het opslaan');
    }
  }

  if (result) {
    return Response(200, result);
  }
  else {
    return Response(403, 'Invalide gegevens');
  }
}