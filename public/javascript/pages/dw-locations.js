import {locations} from '../Content.js';
import { each } from '../Helpers.js';

customElements.define('dw-locations', class DwLocations extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <h1 class="page-title">Locaties</h1>
<!--      <div id="map" class="map"></div>-->
        ${each(locations, (item) => `
          <div class="location-item strip ${item.isActive ? 'active' : ''}">
            <main>
              <h2 class="title">${item.title}</h2>
              <a class="link" href="${item.navigation}" target="_blank">${item.title}</a>
            </main>
            <iframe class="svg" src="/images/${item.image}.svg" onload="svger(this)"></iframe>
          </div>
        `)}      
    `;

    // mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsYmVla2UyIiwiYSI6ImNqNDRrMDdlODE1NGwycWxncDJ5YXpnam8ifQ.FIVSIn6VphQszMzxFK6OQA';
    // this.map = new mapboxgl.Map({
    //   container: 'map',
    //   style: '/map-style.json',
    //   center: [5.1569014, 52.0335477],
    //   zoom: 9,
    //   attributionControl: false
    // });
  }

});
