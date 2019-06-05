import {checkHash, Response} from "./helpers";
import AWS from 'aws-sdk';
AWS.config.update({region: 'eu-west-1'});

export async function getPhotos (event) {
  if (!event.queryStringParameters['one-time-login']) {
    return Response(400, 'Please provide the query argument one-time-login');
  }

  if (!event.queryStringParameters['mail']) {
    return Response(400, 'Please provide the query argument mail');
  }

  const mail = event.queryStringParameters.mail;
  const oneTimeLogin = event.queryStringParameters['one-time-login'];

  let listing = [];

  if (checkHash(mail, oneTimeLogin)) {
    let s3 = new AWS.S3();

    let params = {
      Bucket: 'trouwen',
      Delimiter: '',
    };

    let objects = await s3.listObjectsV2(params).promise();

    if (objects) {
      let promises = objects.Contents.map(object => {
        let params = {
          Bucket: 'trouwen',
          Key: object.Key,
        };

        return s3.headObject(params).promise();
      });

      let metaItems = await Promise.all(promises);
      metaItems.forEach((object, index) => {
        listing.push({
          message: object.Metadata.message,
          key: objects.Contents[index].Key
        })
      })
    }
  }

  return Response(200, listing);
};
