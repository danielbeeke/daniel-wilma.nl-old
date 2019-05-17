customElements.define('dw-login-callback', class DwLoginCallback extends HTMLElement {

  constructor () {
    super();

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      firebase.auth().signInWithEmailLink(email, window.location.href)
      .then(function(result) {
        window.localStorage.removeItem('emailForSignIn');
        history.pushState({}, '', '/');
        app.router.navigate('home');
      })
      .catch(function(error) {
        console.log(error)
      });
    }
  }

});
