customElements.define('dw-locations', class DwLocations extends HTMLElement {

  constructor() {
    super();

  }

  connectedCallback() {
    this.innerHTML = `
      <h1 class="page-title">Locaties</h1>
    `;
  }

});
