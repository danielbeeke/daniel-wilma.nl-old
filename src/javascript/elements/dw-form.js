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
      this.createForm();
      this.render();
      this.isHidden = false;

      setTimeout(() => {
        this.render();
      }, 50);
    })
  }

  createForm () {
    this.form = [
      {
        type: 'radio',
        label: 'Kom je ook?',
        options: {
          'YES': 'Natuurlijk kom ik!',
          'NO': 'Nee dit feestje is te leuk voor mij',
        },
        name: 'KOMT',
        value: app.mailchimp.merge_fields.KOMT
      }
    ];

    console.log(this.form)
  }

  render() {
    return html`
      <form class="${ 'form profile' + (this.isHidden ? ' hidden' : '') }" onkeyup="${this.formChanges.bind(this)}" onchange="${this.formChanges.bind(this)}">
    
        ${this.form.map(field => html`
          <div class="${'form-item ' + field.type + '-wrapper'}">
            <label class="field-label">${ field.label }</label>
            
            ${ field.type === 'radio' ? html`
              ${Object.entries(field.options).map((item) => html`
                <label class="radio-label" for="${field.name + '-' + item[0]}">
                  <input id="${field.name + '-' + item[0]}" type="radio" checked="${field.value === this.value}" name="${field.name}" value="${item[0]}" required>            
                  <span>${item[1]}</span>
                </label>
              `)}
            ` : ''}
            
            ${field.type === 'input' ? html`
            ` : ''}

          </div>
        `)}
    
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