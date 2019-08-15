import {program} from '../Content.js';
import { each } from '../Helpers.js';

customElements.define('dw-program', class DwProgram extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <h1 class="page-title">Programma, <span class="small">we nodigen je van harte uit:</span></h1>

      ${each(program, (item, index) => `
        <div class="program-item strip expandable ${item.isActive ? 'is-now' : ''}">
          <span class="time">${item.isActive ? '- Nu -' : item.time}</span>
          <main>
            <h2 class="title">${item.title}</h2>
            <a class="link" href="${item.location.navigation}" target="_blank">${item.location.title}</a>
            <div class="description">
              <p>Adres: ${item.location.address}</p>
              <p>${item.description}</p>
            </div>
          </main>
          <iframe class="svg" src="/images/flower${index + 1}.svg" onload="svger(this)"></iframe>
        </div>
      `)}     
    `;

    let strips = [...this.querySelectorAll('.strip')];
    strips.forEach(strip => {
      strip.addEventListener('click', () => {
        strip.classList.toggle('active')
      })
    })
  }

});
