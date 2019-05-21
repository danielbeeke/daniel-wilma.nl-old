customElements.define('dw-home', class DwHome extends HTMLElement {

  constructor () {
    super();

    this._status = 'rest';

    app.addEventListener('profile.loaded', () => {
      this.form = document.createElement('dw-form');
      this.form.classList.add('hidden');
      this.form.classList.add('profile');

      this.form.addEventListener('change', () => {
        this.status = 'rest';
      });

      this.form.schema = [
        {
          name: 'KOMT',
          label: 'Kom je ook?',
          type: 'radios',
          options: {
            'YES': 'Ja, natuurlijk kom ik!',
            'NO': 'Dit feestje is te leuk voor mij'
          }
        },
        {
          name: 'VOORNAAM',
          label: 'Voornaam',
          type: 'text',
          visible: { 'KOMT': 'YES' }
        },
        {
          name: 'ACHTERNAAM',
          label: 'Achternaam',
          type: 'text',
          visible: { 'KOMT': 'YES' }
        },
        {
          name: 'ADRES.addr1',
          label: 'Straat en huisnummer',
          type: 'text',
          visible: { 'KOMT': 'YES' }
        },
        {
          name: 'ADRES.zip',
          label: 'Postcode',
          type: 'text',
          visible: { 'KOMT': 'YES' }
        },
        {
          name: 'ADRES.city',
          label: 'Woonplaats',
          type: 'text',
          visible: { 'KOMT': 'YES' }
        },
        {
          name: 'PERSONEN',
          min: 1,
          max: 10,
          label: 'Aantal personen',
          type: 'number',
          visible: { 'KOMT': 'YES' }
        },
        {
          name: 'submit',
          nodeType: 'button',
          innerHTML: 'Opslaan',
          onclick: (event) => {
            this.button = event.target;
            this.saveProfile()
          }
        }
      ];

      this.form.data = app.profile.merge_fields;
      this.appendChild(this.form);

      setTimeout(() => {
        this.form.classList.remove('hidden');
      }, 100);
    })
  }

  get status () {
    return this._status;
  }

  /**
   * States and their classes and texts.
   * @param status
   */
  set status (status) {
    if (status === 'rest' && this.button) {
      this.button.innerHTML = 'Opslaan';
      this.button.classList.remove('hidden');
      this.button.classList.remove('not-clickable');
    }

    if (status === 'busy') {
      this.button.innerHTML = 'Bezig...';
      this.button.classList.add('is-progressing');
      this.button.classList.add('not-clickable');
    }

    if (status === 'done') {
      this.button.innerHTML = 'Gelukt!';
      this.button.classList.remove('is-progressing');
    }

    if (status === 'reloading') {
      this.button.classList.add('hidden');
    }

    if (status === 'error') {
      this.button.classList.remove('is-progressing');
      this.button.classList.remove('hidden');
      this.button.innerHTML = 'Woops';
    }

    this._status = status;
  }

  async saveProfile() {
    let mail = localStorage.getItem('mail');
    let oneTimeLogin = localStorage.getItem('one-time-login');

    if (this.status !== 'rest' || !mail || !oneTimeLogin) { return }

    this.status = 'busy';

    try {
      let response = await fetch(`${app.apiUrl}updateProfile?mail=${mail}&one-time-login=${oneTimeLogin}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ merge_fields: app.profile.merge_fields })
      });

      response = response.json();

      if (!response.error) {
        this.status = 'done';
        setTimeout(() => {
          this.status = 'reloading';
        }, 3000);
      }
      else {
        console.log('Oops something went wrong while updating your profile.', response);
        this.status = 'error';
      }
    }
    catch (exception) {
      console.log(exception);
      this.status = 'error';
    }
  }

});