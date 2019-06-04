import {Router} from './Router.js';
import './elements/dw-profile.js';
import './elements/dw-login.js';
import './elements/dw-login-process.js';
import './elements/dw-form.js';
import './elements/dw-camera.js';
import './elements/dw-menu.js';
import './elements/dw-photos.js';
import './elements/dw-anon-information.js';

class App extends EventTarget {
  constructor () {
    super();
    this.apiUrl = localStorage.getItem('apiUrl') || 'https://4403980yfa.execute-api.eu-west-1.amazonaws.com/prod/';
    this.busy = false;
    window.app = this;

    app.element = document.querySelector('.app');

    this.menu = document.createElement('dw-menu');
    this.element.before(this.menu);

    app.router = new Router({
      home: 'profile',
      routes: {
        'profile': 'profile',
        'information': 'anon-information',
        'camera': 'camera',
        'photos': 'photos',
        'login': 'login',
        'login-process': 'login-process',
        'logout': () => {
          localStorage.removeItem('mail');
          localStorage.removeItem('one-time-login');
          this.dispatchEvent(new CustomEvent('profile.change'));
          app.router.navigate('login');
        }
      }
    });

    this.checkUrlForCredentials();

    if (!localStorage.getItem('mail') || !localStorage.getItem('one-time-login')) {
      app.router.navigate('login');
    }

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
      app.router.navigate('form');
    }
  }

  /**
   * Fetches the profile of the current user from Mailchimp
   */
  getProfile () {
    let mail = localStorage.getItem('mail');
    let oneTimeLogin = localStorage.getItem('one-time-login');

    if (this.busy || !mail || !oneTimeLogin) {
      this.dispatchEvent(new CustomEvent('profile.change'));
      return;
    }

    this.busy = true;

    fetch(`${app.apiUrl}getProfile?mail=${mail}&one-time-login=${oneTimeLogin}`)
      .then(response => response.json())
      .then(response => {
        if (!response.error) {
          this.profile = response;
          this.dispatchEvent(new CustomEvent('profile.loaded'));
          this.dispatchEvent(new CustomEvent('profile.change'));
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