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

    if (profileResponse.status !== 200) {
      return false;
    }

    return await profileResponse.json();
  }
  catch (error) {
    return {
      error: error
    };
  }

}

export async function updateMailchimpProfile(mail, data) {
  let subscriberHash = md5(mail.toLowerCase());

  try {
    let response = await fetch(`${mailchimpListUrl}/members/${subscriberHash}`, {
      headers: {
        'Authorization': 'apikey ' + process.env.mailchimp
      },
      method: 'PATCH',
      body: JSON.stringify( {merge_fields: data})
    });

    if (response.status !== 200) {
      return false;
    }

    return await response.json();
  }
  catch (error) {
    console.log(error)
  }
}


export async function createMailchimpProfile(data) {
  try {
    let APIResponse = await fetch(`${mailchimpListUrl}/members/`, {
      headers: {
        'Authorization': 'apikey ' + process.env.mailchimp
      },
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (APIResponse.status !== 200) {
      return false;
    }

    return await APIResponse.json();
  }
  catch (error) {
    console.log(error)
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
