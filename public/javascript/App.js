import {Router} from './Router.js';

import './Helpers.js';

import './pages/dw-home.js';
import './pages/dw-profile.js';
import './elements/dw-form.js';

class App extends EventTarget {
  constructor () {
    super();
    this.apiUrl = localStorage.getItem('apiUrl') || 'https://4403980yfa.execute-api.eu-west-1.amazonaws.com/prod/';
    window.app = this;

    app.element = document.querySelector('.app');

    app.router = new Router({
      home: 'welkom',
      routes: {
        'welkom': 'home',
      }
    });
  }

}

new App();