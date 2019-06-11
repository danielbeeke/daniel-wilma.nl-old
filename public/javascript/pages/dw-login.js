customElements.define('dw-login', class DwLogin extends HTMLElement {

  constructor () {
    super();

    this.mail = '';
    this._status = 'rest';
    this.message = '';

    this.form = document.createElement('form', { is: 'dw-form' });

    this.form.schema = [
      {
        name: 'mail',
        required: true,
        label: 'E-mail',
        type: 'email',
      },
      {
        name: 'submit',
        nodeType: 'button',
        innerHTML: 'Stuur inloglink',
      }
    ];

    this.form.addEventListener('submit', () => {
      this.login()
    });

    this.form.data = this;
    this.appendChild(this.form);
    this.button = this.form.querySelector('button');
  }

  get status () {
    return this._status;
  }

  /**
   * States and their classes and texts.
   * @param status
   */
  set status (status) {
    if (status === 'rest') {
      this.button.innerHTML = 'Stuur inloglink';
      this.button.classList.remove('hidden');
      this.button.classList.remove('not-clickable');
    }

    if (status === 'busy') {
      this.button.innerHTML = 'Versturen...';
      this.button.classList.add('is-progressing');
      this.button.classList.add('not-clickable');
    }

    if (status === 'done') {
      this.button.innerHTML = this.message;
      this.button.classList.remove('is-progressing');
      this.mail = '';
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


  async login() {
    if (this.status !== 'rest') { return }

    this.status = 'busy';

    try {
      let response = await fetch(`${app.apiUrl}welcomeMail?mail=${this.mail}`);

      response = await response.json();

      this.message = response.message;

      if (!response.error) {
        this.status = 'done';
      }
      else {
        console.log('Oops something went wrong while sending a welcome mail.', response);
        this.status = 'error';
      }
    }
    catch (exception) {
      console.log(exception);
      this.status = 'error';
    }
  }

});
