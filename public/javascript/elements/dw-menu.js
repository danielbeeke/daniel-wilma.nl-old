customElements.define('dw-menu', class DwMenu extends HTMLElement {

  connectedCallback () {
    this.innerHTML = this.menuIcon() + '<div class="menu"><div class="menu-wrapper"><h1 class="page-title">Menu</h1><div class="inner"></div></div></div>';
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

      let newActive = this.querySelector(`.menu-link[href="#${path}"]`);
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
      <a class="menu-link" href="#login">Inloggen</a>
      <a class="menu-link" href="#locations">Locaties</a>
      <a class="menu-link" href="#information">Informatie</a>
    `;
  }

  authenticated () {
    return `
      <a class="menu-link" href="#program">Programma</a>
      <a class="menu-link" href="#locations">Locaties</a>
      <a class="menu-link" href="#profile">Aanmeldformulier</a>
      <span>
        <a class="menu-link" href="#camera">Camera</a><span class="separator"> / </span><a class="menu-link" href="#photos">Foto's</a>
      </span>
      <a class="menu-link" href="#logout">Uitloggen</a>
    `;
  }

});
