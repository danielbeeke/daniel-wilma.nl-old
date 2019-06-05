customElements.define('dw-photos', class DwPhotos extends HTMLElement {

  constructor () {
    super();

    this.busy = false;

    this.getPhotos();
  }

  render () {
    this.innerHTML = '';

    let markup = '';

    this.photos.forEach(photo => {
      markup += `<img src="https://trouwen.s3-eu-west-1.amazonaws.com/${photo.key}">`;
    });

    this.innerHTML = markup;
  }

  getPhotos () {
    let mail = localStorage.getItem('mail');
    let oneTimeLogin = localStorage.getItem('one-time-login');

    if (this.busy || !mail || !oneTimeLogin) {
      return;
    }

    this.busy = true;

    fetch(`${app.apiUrl}getPhotos?mail=${mail}&one-time-login=${oneTimeLogin}`)
      .then(response => response.json())
      .then(response => {
        if (!response.error) {
          this.photos = response;
          this.render();
          this.busy = false;
        }
        else {
          console.log('Oops something went wrong while getting photos.', response);
        }
      })
      .catch(error => {
        console.log(error)
      });
  }

});
