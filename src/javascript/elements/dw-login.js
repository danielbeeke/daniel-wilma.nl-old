customElements.define('dw-login', class DwLogin extends HTMLElement {

  constructor () {
    super();

    this.busy = false;

    this.innerHTML = `
      <form class="login form">
        <label class="field-label" for="email-field">Je emailadres</label>
        <input id="email-field" type="email" placeholder="john@doe.com" required>
        <button type="submit">Inloggen</button>
        <div class="message hidden">Er is een email gestuurd, heb je het ontvangen? Het kan eventjes duren.</div>
      </form>
    `;

    this.form = this.querySelector('form');
    this.form.addEventListener('submit', () => {
      this.login()
    })
  }

  login () {
    if (!this.busy) {
      this.busy = true;


      this.busy = false;
    }
    console.log('test')
  }

});
