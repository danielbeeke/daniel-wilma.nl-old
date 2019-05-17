import {render, html} from 'https://unpkg.com/lighterhtml?module';

customElements.define('dw-home', class DwHome extends HTMLElement {

  constructor () {
    super();

    this.render = render.bind(this, this, this.render);
    this.render();
  }

  render() {
    return html`
        <dw-form/>
    `;
  }

});