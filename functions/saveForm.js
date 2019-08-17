import {Response, getMailchimpProfileByMail, updateMailchimpProfile, createMailchimpProfile} from './helpers.js';

export async function saveForm (event) {
  let data = JSON.parse(event.body);

  if (!data.Email) { return Response(403, 'Het e-mailadres moet worden ingevuld.'); }
  if (!data.Persons) { return Response(403, 'Het aantal personen moet worden ingevuld.'); }
  if (!data.FirstName) { return Response(403, 'De voornaam moet worden ingevuld.'); }
  if (!data.LastName) { return Response(403, 'De achternaam moet worden ingevuld.'); }
  if (!data.Presence) { return Response(403, 'De aanwezigheid moet worden ingevuld.'); }

  let mergeFields = {
    VOORNAAM: data.FirstName,
    ACHTERNAAM: data.FirstName,
    KOMT: data.Presence === 'yes' ? 'Ja' : 'Nee',
    PERSONEN: data.Persons,
  };

  try {
    let profile = await getMailchimpProfileByMail(data.Email);

    if (!profile) {
      let mailchimpData = {
        email_address: data.Email,
        status: 'subscribed',
        merge_fields: mergeFields
      };

      await createMailchimpProfile(mailchimpData);

      return Response(200, {
        status: 'created',
        success: true
      });
    }
    else {
      await updateMailchimpProfile(data.Email, mergeFields);

      return Response(200, {
        status: 'updated',
        success: true
      });
    }
  }
  catch (error) {
    return Response(405, {
      status: 'error',
      error: error,
      success: false
    });
  }
}