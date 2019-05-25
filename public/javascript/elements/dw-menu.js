customElements.define('dw-menu', class DwMenu extends HTMLElement {

  connectedCallback () {
    this.fillMenu();

    app.addEventListener('profile.change', () => {
      this.fillMenu();
    });
  }

  fillMenu () {
    if (localStorage.getItem('mail') && localStorage.getItem('one-time-login')) {
      this.innerHTML = this.menuIcon() + this.authenticated();
    }
    else {
      this.innerHTML = this.menuIcon() + this.anonymous();
    }

    this.toggle = this.querySelector('.menu-toggle');

    this.toggle.addEventListener('click', () => {
      document.body.classList.toggle('has-menu-expanded');
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
        <div class="menu">
          <div class="inner">
            <a class="menu-link" href="#login">Inloggen</a>
            <a class="menu-link" href="#information">Informatie</a>
          </div>  
        </div>
    `;
  }

  authenticated () {
    return `
        <div class="menu">
          <div class="inner">
            <a class="menu-link" href="#profile">Aanmeldformulier</a>
            <a class="menu-link" href="#photo">Camera</a>
            <a class="menu-link" href="#logout">Uitloggen</a>
          </div>
        </div>
    `;
  }

});
