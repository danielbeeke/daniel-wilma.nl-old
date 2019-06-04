import {Response, getMailchimpProfileByMail} from './helpers.js';
import {checkHash} from "./helpers";

export async function getProfile (event) {
  if (!'one-time-login' in event.queryStringParameters) {
    return Response(400, 'Please provide the query argument one-time-login');
  }

  if (!'mail' in event.queryStringParameters) {
    return Response(400, 'Please provide the query argument mail');
  }

  const mail = event.queryStringParameters.mail;
  const oneTimeLogin = event.queryStringParameters['one-time-login'];

  let profile = false;

  if (checkHash(mail, oneTimeLogin)) {
    profile = await getMailchimpProfileByMail(mail);
  }

  if (profile) {
    return  Response(200, profile);
  }
  else {
    return Response(403, 'Helaas, het lijkt er op dat je (nog) geen gast bent.');
  }
};