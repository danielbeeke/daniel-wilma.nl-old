customElements.define('dw-login-process', class DwLoginProcess extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `Er is een mailtje naar je mail adres gestuurd. Daarin zit een knop om in te loggen.`;
  }

});
