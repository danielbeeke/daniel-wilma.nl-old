import {Router} from './Router.js';

import './Helpers.js';

import './pages/dw-home.js';
import './pages/dw-profile.js';
import './pages/dw-login.js';
import './pages/dw-camera.js';
import './pages/dw-photos.js';
import './pages/dw-program.js';
import './pages/dw-locations.js';

import './elements/dw-form.js';
import './elements/dw-menu.js';

class App extends EventTarget {
  constructor () {
    super();
    this.apiUrl = localStorage.getItem('apiUrl') || 'https://4403980yfa.execute-api.eu-west-1.amazonaws.com/prod/';
    this.busy = false;
    window.app = this;

    app.element = document.querySelector('.app');

    app.router = new Router({
      home: 'welkom',
      routes: {
        'welkom': 'home',
        // 'aanmeldformulier': 'profile',
        // 'camera': 'camera',
        // 'fotos': 'photos',
        'inloggen': 'login',
        // 'programma': 'program',
        // 'locaties': 'locations',
        'uitloggen': () => {
          localStorage.removeItem('mail');
          localStorage.removeItem('one-time-login');
          this.dispatchEvent(new CustomEvent('profile.change'));
          app.router.navigate('login');
        }
      }
    });

    this.checkUrlForCredentials();

    if ((!localStorage.getItem('mail') || !localStorage.getItem('one-time-login')) && app.router.currentRoute !== 'welkom') {
      app.router.navigate('home');
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