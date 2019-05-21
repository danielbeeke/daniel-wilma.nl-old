import {Router} from './Router.js';
import './elements/dw-home.js';
import './elements/dw-login.js';
import './elements/dw-form.js';

class App extends EventTarget {
  constructor () {
    super();
    this.apiUrl = localStorage.getItem('apiUrl') || 'https://us-central1-trouwen-d591e.cloudfunctions.net/';
    this.busy = false;
    window.app = this;

    app.user = {};

    app.element = document.querySelector('#app');

    app.router = new Router({})
    .add('home', () => {
      app.element.innerHTML = '<dw-home/>';
    })
    .add('login', () => {
      app.element.innerHTML = '<dw-login/>';
    })
    .add('logout', () => {
      app.router.navigate('home');
    });

    this.checkUrlForCredentials();

    if (!localStorage.getItem('mail') || !localStorage.getItem('one-time-login')) {
      app.router.navigate('login');
    }

    app.router.listen();
    this.getProfile();
  }

  /**
   * Checks the url for mail & one-time-login and sets them in the localStorage.
   */
  checkUrlForCredentials () {
    if (location.search) {
      let searchParams = new URLSearchParams(location.search);

      for (let [key, value] of searchParams) {
        if (['mail', 'one-time-login'].includes(key)) {
          localStorage.setItem(key, value);
        }
      }

      history.pushState({}, '', '/');
      app.router.navigate('home');
    }
  }

  /**
   * Returns the profile of the current user from Mailchimp
   * @returns {Promise<any | never>}
   */
  getProfile () {
    if (this.busy) { return new Promise.resolve() }

    let mail = localStorage.getItem('mail');
    let oneTimeLogin = localStorage.getItem('one-time-login');

    this.busy = true;

    return fetch(`${app.apiUrl}getProfile?mail=${mail}&one-time-login=${oneTimeLogin}`)
      .then(response => response.json())
      .then(response => {
        if (!response.error) {
          this.profile = response;
          this.dispatchEvent(new CustomEvent('profile.loaded'));
          this.busy = false;
        }
        else {
          console.log('Oops something went wrong while getting your profile.', response);
        }
      })
      .catch(error => {
        console.log(error)
      });
  }
}

new App();