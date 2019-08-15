customElements.define('dw-menu', class DwMenu extends HTMLElement {

  connectedCallback () {
    this.innerHTML = this.menuIcon() + `
        <div class="menu"><div class="menu-wrapper">
          <h1 class="page-title">Menu, <span class="small">Waar, wanneer, vertel!</span></h1>
          <div class="inner"></div>
          </div>
        </div>`;
    this.toggle = this.querySelector('.menu-toggle');

    this.toggle.addEventListener('click', () => {
      document.body.classList.toggle('has-menu-expanded');
    });

    this.wrapper = this.querySelector('.menu .inner');
    this.fillMenu();


    document.addEventListener('keyup', (event) => {
      if (document.body.classList.contains('has-menu-expanded') && event.key === 'Escape') {
        document.body.classList.remove('has-menu-expanded');
      }
    });

    window.addEventListener('routechange', (event) => {
      this.fillMenu();

      let path = event.detail.route.route.source;
      let previouslyActive = this.querySelector('.menu-link.active');
      if (previouslyActive) {
        previouslyActive.classList.remove('active');
      }

      let newActive = this.querySelector(`.menu-link[href="#/${path}"]`);
      if (newActive) {
        newActive.classList.add('active');
      }
    });
  }

  fillMenu () {
    if (localStorage.getItem('mail') && localStorage.getItem('one-time-login')) {
      this.wrapper.innerHTML = this.authenticated();
    }
    else {
      this.wrapper.innerHTML = this.anonymous();
    }

    this.menuItems = this.querySelectorAll('.menu-link');

    Array.from(this.menuItems).forEach((menuItem) => {
      menuItem.addEventListener('click', () => {
        this.close();
      });
    });

  }

  close () {
    document.body.classList.remove('has-menu-expanded');
  }

  menuIcon () {
    return `
      <div class="menu-toggle">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;
  }

  anonymous () {
    return `        
<!--      <a class="menu-link" href="#/welkom">Welkom</a>-->
<!--      <a class="menu-link" href="#/locaties">Locaties</a>-->
<!--      <a class="menu-link" href="#/programma">Programma</a>-->
      <a class="menu-link" href="#/inloggen">Inloggen</a>
    `;
  }

  authenticated () {
    return `
<!--      <a class="menu-link" href="#/welkom">Welkom</a>-->
<!--      <a class="menu-link" href="#/programma">Programma</a>-->
<!--      <a class="menu-link" href="#/locaties">Locaties</a>-->
<!--      <a class="menu-link" href="#/aanmeldformulier">Aanmeldformulier</a>-->
<!--      <span>-->
<!--        <a class="menu-link" href="#/camera">Camera</a><span class="separator"> / </span><a class="menu-link" href="#/fotos">Foto's</a>-->
<!--      </span>-->
      <a class="menu-link" href="#/uitloggen">Uitloggen</a>
    `;
  }

});
