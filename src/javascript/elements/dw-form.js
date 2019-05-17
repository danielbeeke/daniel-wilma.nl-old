import {render, html} from 'https://unpkg.com/lighterhtml?module';

customElements.define('dw-form', class DwForm extends HTMLElement {

  constructor() {
    super();

    this.isHidden = true;
    this.render = render.bind(this, this, this.render);

    app.addEventListener('user.mailchimp', () => {
      this.render();
      this.isHidden = false;

      setTimeout(() => {
        this.render();
      }, 50);
    })
  }

  render() {
    return html`
      <form class="${ 'form profile' + (this.isHidden ? ' hidden' : '') }" onkeyup="${this.formChanges.bind(this)}" onchange="${this.formChanges.bind(this)}">
      
        <div class="row">
          <div class="form-item">
            <label class="field-label" for="first-name">Naam</label>
            <input id="first-name" type="text" data-name="VOORNAAM" required value="${app.mailchimp.merge_fields.VOORNAAM}">            
          </div>

          <div class="form-item">
            <label class="field-label" for="last-name">Achternaam</label>
            <input id="last-name" type="text" data-name="ACHTERNAAM" required value="${app.mailchimp.merge_fields.ACHTERNAAM}">
          </div>
        </div>
        
        <div class="form-item">
          <label class="field-label" for="address-addr1">Straatnaam en huisnummer</label>
          <input id="address-addr1" type="text" data-name="ADRES.addr1" required value="${app.mailchimp.merge_fields.ADRES.addr1}">
        </div>

        <div class="row">
          <div class="form-item address-zip">
            <label class="field-label" for="address-zip">Postcode</label>
            <input id="address-zip" type="text" data-name="ADRES.zip" required value="${app.mailchimp.merge_fields.ADRES.zip}">
          </div>
  
          <div class="form-item city">
            <label class="field-label" for="address-city">Woonplaats</label>
            <input id="address-city" type="text" data-name="ADRES.city" required value="${app.mailchimp.merge_fields.ADRES.city}">
          </div>
        </div>
        
        <button type="submit" onclick="${this.saveProfile.bind(this)}">Bijwerken</button>

      </form>
    `;
  }

  formChanges (event) {
    eval(`app.mailchimp.merge_fields.${event.target.dataset.name} = '${event.target.value}'`);
  }

  saveProfile(event) {

  }

});