import {render, html} from 'https://unpkg.com/lighterhtml?module';

customElements.define('dw-login', class DwLogin extends HTMLElement {

  constructor () {
    super();

    if (firebase.auth().currentUser) {
      app.router.navigate('home');
    }

    // State
    this.signInMailHasBeenSend = false;
    this.email = '';

    this.render = render.bind(this, this, this.render);
    this.render();
  }

  render() {
    return html`
        <form class="login form">
            <label class="field-label" for="email-field">Je emailadres</label>
            <input onkeyup="${this.updateEmail.bind(this)}" onchange="${this.updateEmail.bind(this)}" id="email-field" type="email" placeholder="john@doe.com" required>
            <button type="submit" onclick="${this.login.bind(this)}">Inloggen</button>
            ${this.signInMailHasBeenSend ? html`
                <div class="message">Er is een email naar het adres <strong>${this.email}</strong> gestuurd, heb je het ontvangen? Het kan eventjes duren.</div>
            ` : ''}
        </form>
    `;
  }

  updateEmail(event) {
    this.email = event.target.value;
    this.render();
  }

  login (event) {
    firebase.auth().sendSignInLinkToEmail(this.email, {
      url: location.origin + '/#/login-callback',
      handleCodeInApp: true
    })
    .then(() => {
      window.localStorage.setItem('emailForSignIn', this.email);
      this.signInMailHasBeenSend = true;
      this.render();
    })
    .catch((error) => {
      console.log(error)
    });
  }

});
