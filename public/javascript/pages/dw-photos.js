customElements.define('dw-photos', class DwPhotos extends HTMLElement {

  constructor () {
    super();
    this.busy = false;
    this.getPhotos();
  }

  render () {
    this.innerHTML = '';

    let markup = '<h1 class="page-title hidden">Foto\'s</h1><div class="inner">';

    this.photos.forEach(photo => {
      markup += `<div class="photo-wrapper"><div class="inner">
        <img src="https://trouwen.s3-eu-west-1.amazonaws.com/${photo.key}">
        <span class="guest-message">${photo.message}</span>
        </div>
      </div>`;
    });

    this.innerHTML = markup + '</div>';

    let removeActive = (photo) => {
      photo.classList.remove('selected');
      photo.removeAttribute('style');
    };

    this.photos = this.querySelectorAll('.photo-wrapper');
    let title = this.querySelector('.page-title');
    Array.from(this.photos).forEach(photo => {
      photo.querySelector('img').addEventListener('load', () => {
        setTimeout(() => {
          photo.classList.add('loaded');
          title.classList.remove('hidden')
        }, 500);
      });

      photo.addEventListener('click', () => {
        if (photo.classList.contains('selected')) {
          removeActive(photo);
          this.classList.remove('has-active')
        }
        else {
          let otherSelectedItems = this.querySelectorAll('.photo-wrapper.selected');
          let oldCount = otherSelectedItems.length;
          Array.from(otherSelectedItems).forEach(otherSelectedItem => {
            removeActive(otherSelectedItem)
          });

          let expand = () => {
            let rect = photo.getBoundingClientRect();
            let pixelsNeededToCenterLeft = (window.innerWidth / 2) - rect.x - (photo.offsetWidth / 2);
            let pixelsNeededToCenterTop = (window.innerHeight / 2) - rect.y - (photo.offsetHeight / 2);

            photo.style.transform = `translate(${pixelsNeededToCenterLeft}px, ${pixelsNeededToCenterTop}px) scale(2) rotate(0deg)`;
            photo.classList.add('selected');
            this.classList.add('has-active')
          };

          if (oldCount) {
            setTimeout(expand, 400);
          }
          else {
            expand();
          }
        }
      });
    });

    this.addEventListener('click', (event) => {
      if (event.target.classList.contains('inner') || event.target === this) {
        let otherSelectedItems = this.querySelectorAll('.photo-wrapper.selected');
        Array.from(otherSelectedItems).forEach(otherSelectedItem => {
          removeActive(otherSelectedItem);
          this.classList.remove('has-active')
        });
      }
    });

    document.addEventListener('keyup', (event) => {
      let currentActive = this.querySelector('.photo-wrapper.selected');

      if (['ArrowLeft', 'ArrowRight'].includes(event.key) && currentActive) {
        let next = false;

        if (event.key === 'ArrowLeft') {
          next = currentActive.previousElementSibling;
        }

        if (event.key === 'ArrowRight') {
          next = currentActive.nextElementSibling;
        }

        removeActive(currentActive);
        this.classList.remove('has-active');
        next.click();
      }

      if (currentActive && event.key === 'Escape') {
        removeActive(currentActive);
        this.classList.remove('has-active')
      }
    })
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
