import {Router} from './Router.js';
import './elements/dw-home.js';
import './elements/dw-login.js';
import './elements/dw-login-callback.js';
import './elements/dw-form.js';

class App extends EventTarget {
  constructor () {
    super();
    window.app = this;

    firebase.initializeApp({
      apiKey: "AIzaSyC8y0wdaIkZQJTlr6hdBVSFFZPUdMdD0k4",
      authDomain: "trouwen-d591e.firebaseapp.com",
      databaseURL: "https://trouwen-d591e.firebaseio.com",
      projectId: "trouwen-d591e",
      storageBucket: "trouwen-d591e.appspot.com",
      messagingSenderId: "1064935969828",
      appId: "1:1064935969828:web:506fcaeecb83a4e7"
    });

    app.user = {};

    firebase.auth().onAuthStateChanged((user) => {
      app.user = user;

      if (app.user) {
        fetch(`http://localhost:5001/trouwen-d591e/us-central1/getProfile?uid=${app.user.uid}`)
          .then(response => response.json())
          .then(mailchimp => {
            app.mailchimp = mailchimp;
            this.dispatchEvent(new CustomEvent('user.mailchimp'));
          });
      }
      else {
        app.router.navigate('login');
      }

      this.dispatchEvent(new CustomEvent('user.profile'));
    });

    app.element = document.querySelector('#app');

    app.router = new Router({})
    .add('home', () => {
      app.element.innerHTML = '<dw-home/>';
    })
    .add('login', () => {
      app.element.innerHTML = '<dw-login/>';
    })
    .add('logout', () => {
      firebase.auth().signOut().then(function() {
        app.router.navigate('home');
      });
    })
    .add('login-callback', () => {
      app.element.innerHTML = '<dw-login-callback/>';
    });

    app.router.listen();
  }
}

new App();