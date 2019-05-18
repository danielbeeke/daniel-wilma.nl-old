import {render, html} from 'https://unpkg.com/lighterhtml?module';

customElements.define('dw-form', class DwForm extends HTMLElement {

  constructor() {
    super();

    this.isHidden = true;
    this.status = 'default';
    this.statusText = {
      default: 'Bijwerken',
      updating: 'Bezig...',
      saved: 'Opgeslagen'
    };
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
    
        <div class="form-item radio-wrapper">
          <label class="field-label">Kom je ook?</label>
          
          <label class="radio-label" for="come-1">
            <input id="come-1" type="radio" name="KOMT" checked="${app.mailchimp.merge_fields.KOMT === this.value ? 'true' : 'false'}" required value="YES">            
            <span>Natuurlijk kom ik!</span>
          </label>
          
          <label class="radio-label" for="come-3">
            <input id="come-3" type="radio" name="KOMT" checked="${app.mailchimp.merge_fields.KOMT === this.value ? 'true' : 'false'}" required value="NO">            
            <span>Nee dit feestje is te leuk voor mij</span>
          </label>
        </div>
        
        ${app.mailchimp.merge_fields.KOMT === 'YES' ? html`
                <div class="form-item radio-wrapper">
          <label class="field-label">Heb je dieet wensen?</label>
          
          <label class="radio-label" for="diet-1">
            <input id="diet-1" type="radio" name="DIEET" checked="${app.mailchimp.merge_fields.DIEET === this.value ? 'true' : 'false'}" required value="DEFAULT">            
            <span>Geen wensen</span>
          </label>
          
          <label class="radio-label" for="diet-2">
            <input id="diet-2" type="radio" name="DIEET" checked="${app.mailchimp.merge_fields.DIEET === this.value ? 'true' : 'false'}" required value="VEGAN">            
            <span>Veganistisch</span>
          </label>
          
          <label class="radio-label" for="diet-3">
            <input id="diet-3" type="radio" name="DIEET" checked="${app.mailchimp.merge_fields.DIEET === this.value ? 'true' : 'false'}" required value="VEGETARIAN">            
            <span>Vegatarisch</span>
          </label>
          
          <label class="radio-label" for="diet-4">
            <input id="diet-4" type="radio" name="DIEET" value="Anders..." checked="${!['DEFAULT', 'VEGAN', 'VEGETARIAN'].includes(app.mailchimp.merge_fields.DIEET) ? 'checked' : 'false'}" required>            
            <span>Anders</span>
          </label>
          ${!['DEFAULT', 'VEGAN', 'VEGETARIAN'].includes(app.mailchimp.merge_fields.DIEET) ? html`
          <div class="form-item">
            <label class="field-label" for="diet-other">Dieet overig</label>
            <input id="diet-other" type="text" name="DIEET" required value="${app.mailchimp.merge_fields.DIEET}">            
          </div>          
          ` : '' }
        </div>

        <div class="row">
          <div class="form-item">
            <label class="field-label" for="first-name">Naam</label>
            <input id="first-name" type="text" name="VOORNAAM" required value="${app.mailchimp.merge_fields.VOORNAAM}">            
          </div>

          <div class="form-item">
            <label class="field-label" for="last-name">Achternaam</label>
            <input id="last-name" type="text" name="ACHTERNAAM" required value="${app.mailchimp.merge_fields.ACHTERNAAM}">
          </div>
        </div>
        
        <div class="form-item">
          <label class="field-label" for="address-addr1">Straatnaam en huisnummer</label>
          <input id="address-addr1" type="text" name="ADRES.addr1" required value="${app.mailchimp.merge_fields.ADRES.addr1}">
        </div>

        <div class="row">
          <div class="form-item address-zip">
            <label class="field-label" for="address-zip">Postcode</label>
            <input id="address-zip" type="text" name="ADRES.zip" required value="${app.mailchimp.merge_fields.ADRES.zip}">
          </div>
  
          <div class="form-item city">
            <label class="field-label" for="address-city">Woonplaats</label>
            <input id="address-city" type="text" name="ADRES.city" required value="${app.mailchimp.merge_fields.ADRES.city}">
          </div>
        </div>
        
        ` : ''}

        <button type="submit" class="${this.status === 'updating' ? 'is-progressing' : ''}" onclick="${this.saveProfile.bind(this)}">${this.statusText[this.status]}</button>

      </form>
    `;
  }

  formChanges (event) {
    console.log(event.target.name, event.target.value)
    eval(`app.mailchimp.merge_fields.${event.target.name} = '${event.target.value}'`);
    this.render();
  }

  saveProfile(event) {
    event.preventDefault();
    this.status = 'updating';
    this.render();
    fetch(`http://localhost:5001/trouwen-d591e/us-central1/updateProfile?uid=${app.user.uid}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ merge_fields: app.mailchimp.merge_fields })
    })
    .then(response => response.json())
    .then(response => {
      this.status = 'saved';
      this.render();

      setTimeout(() => {
        this.status = 'default';
        this.render();
      }, 2000);
    })
  }

});