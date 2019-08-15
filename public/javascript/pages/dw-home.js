customElements.define('dw-home', class DwHome extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <div class="flower-illustration">
        <iframe class="text" src="/images/text.svg" onload="svger(this)"></iframe>
        <img class="flowers" src="/images/flowers.png" alt="Daniël & Wilma">
        <iframe class="shadows" class="svg" src="/images/shadows.svg" onload="svger(this)"></iframe>      
      </div>
      <dw-profile></dw-profile>
    `;
  }

});
