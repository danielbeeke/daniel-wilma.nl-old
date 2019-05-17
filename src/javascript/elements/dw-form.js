import {render, html} from 'https://unpkg.com/lighterhtml?module';

customElements.define('dw-form', class DwForm extends HTMLElement {

  constructor() {
    super();

    this.render = render.bind(this, this, this.render);

    app.addEventListener('user.mailchimp', () => {
      this.render();
    })
  }

  render() {
    return html`
      <form class="form profile">
        <div class="row">
          <div class="form-item">
            <label class="field-label" for="first-name">Naam</label>
            <input id="first-name" type="text" required value="${app.mailchimp.merge_fields.VOORNAAM}">            
          </div>

          <div class="form-item">
            <label class="field-label" for="last-name">Achternaam</label>
            <input id="last-name" type="text" required value="${app.mailchimp.merge_fields.ACHTERNAAM}">
          </div>
        </div>
        
        <div class="form-item">
          <label class="field-label" for="address-addr1">Straanaam en huisnummer</label>
          <input id="address-addr1" type="text" required value="${app.mailchimp.merge_fields.ADRES.addr1}">
        </div>

        <div class="form-item">
          <label class="field-label" for="address-zip">Postcode</label>
          <input id="address-zip" type="text" required value="${app.mailchimp.merge_fields.ADRES.zip}">
        </div>

        <div class="form-item">
          <label class="field-label" for="address-city">Woonplaats</label>
          <input id="address-city" type="text" required value="${app.mailchimp.merge_fields.ADRES.city}">
        </div>

        <button type="submit" onclick="${this.saveProfile.bind(this)}">Bijwerken</button>

      </form>
    `;
  }

  saveProfile(event) {

  }

});