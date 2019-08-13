customElements.define('dw-program', class DwProgram extends HTMLElement {

  constructor() {
    super();

  }


  connectedCallback() {
    this.innerHTML = `
      <h1 class="page-title">Programma</h1>
      
      <div class="program-item">
        <span class="program-item-time">14:00, 13:45 deuren open.</span>
        <h2 class="program-item-title">Kerkdienst</h2>
        <a href="https://www.google.com/maps/dir/?api=1&destination=NGK Doorn" target="_blank">NGK Doorn</a>
      </div>

      <div class="program-item">
        <span class="program-item-time">15:20</span>
        <h2 class="program-item-title">Receptie</h2>
        <a href="https://www.google.com/maps/dir/?api=1&destination=Moestuin Bartimeus Doorn" target="_blank">Bartimeus Doorn</a>
      </div>
 
      
    `;
  }

});
