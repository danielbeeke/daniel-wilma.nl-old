import md5 from 'md5';
import fetch from 'node-fetch';

export const mailchimpListUrl = 'https://us20.api.mailchimp.com/3.0/lists/d07c3eb514';

export async function getMailchimpProfileByMail (mail) {
  let subscriberHash = md5(mail.toLowerCase());

  try {
    let profileResponse = await fetch(`${mailchimpListUrl}/members/${subscriberHash}`, {
      headers: {
        'Authorization': 'apikey ' + process.env.mailchimp
      }
    });

    return await profileResponse.json();
  }
  catch (error) {
    return {
      error: error
    };
  }

}

export function Response (httpCode, messageOrData) {
  let data = httpCode === 200 ? messageOrData : {
    message: messageOrData
  };

  return {
    statusCode: httpCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data),
  };
}

export function checkHash(mail, hash) {
  return md5(`${mail}+zout-en-spekjes`) === hash;
}
